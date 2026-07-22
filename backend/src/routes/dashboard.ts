import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const teamOwnerIds: string[] = [];

    if (userRole === "owner") {
      teamOwnerIds.push(userId);
    } else {
      const memberships = await prisma.teamMember.findMany({
        where: { userId },
        select: { teamOwnerId: true },
      });
      teamOwnerIds.push(...memberships.map((m) => m.teamOwnerId));
      teamOwnerIds.push(userId);
    }

    const projectWhere = { createdBy: { in: teamOwnerIds } };

    const [
      totalBudget,
      projects,
      inventoryItems,
      lowStockCount,
      memberCount,
      recentActivity,
    ] = await Promise.all([
      prisma.project.aggregate({
        where: projectWhere,
        _sum: { budget: true, spent: true },
      }),
      prisma.project.findMany({
        where: projectWhere,
        orderBy: { createdAt: "desc" },
        include: {
          managedByUser: { select: { name: true } },
        },
      }),
      prisma.inventoryItem.findMany(),
      prisma.inventoryItem.findMany().then((items) =>
        items.filter((i) => i.stock < i.maxStock * 0.3).length
      ),
      prisma.teamMember.count({
        where: { teamOwnerId: { in: teamOwnerIds }, status: "active" },
      }).then((c) => c + teamOwnerIds.length),
      prisma.activity.findMany({
        where: { userId: { in: teamOwnerIds } },
        orderBy: { timestamp: "desc" },
        take: 10,
        include: { user: { select: { name: true } } },
      }),
    ]);

    const milestones = await prisma.milestone.findMany({
      where: { projectId: { in: projects.map((p) => p.id) } },
      orderBy: { date: "asc" },
      take: 10,
    }).catch(() => []);

    const activeProjects = projects.filter((p) => p.status !== "completed").length;
    const completedProjects = projects.filter((p) => p.status === "completed").length;
    const totalMaterials = inventoryItems.reduce((sum, item) => sum + item.stock, 0);

    const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);

    const dashboardStats = {
      totalBudget: totalBudget._sum.budget || 0,
      totalSpent,
      activeProjects,
      completedProjects,
      totalMaterials: Math.round(totalMaterials),
      lowStockItems: lowStockCount,
      teamMembers: memberCount,
    };

    const activity = recentActivity.map((a) => ({
      id: a.id,
      action: a.action,
      user: a.user.name,
      timestamp: a.timestamp.toISOString(),
      type: a.type,
    }));

    const milestoneData = milestones.map((m) => ({
      id: m.id,
      name: m.name,
      date: m.date.toISOString(),
      status: m.status,
    }));

    const projectData = projects.map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      status: p.status,
      progress: p.progress,
      budget: p.budget,
      spent: p.spent,
      startDate: p.startDate.toISOString(),
      endDate: p.endDate.toISOString(),
      engineer: p.managedByUser?.name || "Unassigned",
      description: p.description,
      materialsUsed: p.materialsUsed,
      tasksCompleted: p.tasksCompleted,
      totalTasks: p.totalTasks,
    }));

    res.json({
      dashboardStats,
      recentActivity: activity,
      milestones: milestoneData,
      projects: projectData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
