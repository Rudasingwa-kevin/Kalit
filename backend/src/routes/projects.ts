import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, authorize, type AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const { search, status } = req.query;
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

    const where: any = {
      createdBy: { in: teamOwnerIds },
    };

    if (search && typeof search === "string") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && typeof status === "string" && status !== "all") {
      where.status = status;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        managedByUser: {
          select: { id: true, name: true },
        },
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = projects.map((p) => ({
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

    res.json({ projects: result });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        managedByUser: {
          select: { id: true, name: true },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } },
          },
        },
        materials: {
          include: { inventoryItem: true },
        },
        workers: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
          },
        },
        budgetLines: true,
        milestones: true,
        activities: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { timestamp: "desc" },
          take: 20,
        },
      },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", authorize("owner", "project_manager"), async (req: AuthRequest, res) => {
  try {
    const { name, location, engineer, budget, startDate, endDate, description } = req.body;

    if (!name || !location || !budget || !endDate) {
      res.status(400).json({ error: "Name, location, budget, and end date are required" });
      return;
    }

    let managedBy: string | null = null;
    if (engineer) {
      const engineerUser = await prisma.user.findFirst({
        where: { name: engineer },
      });
      if (engineerUser) managedBy = engineerUser.id;
    }

    const project = await prisma.project.create({
      data: {
        name,
        location,
        budget: Number(budget),
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: new Date(endDate),
        description: description || "",
        createdBy: req.user!.userId,
        managedBy,
      },
    });

    await prisma.activity.create({
      data: {
        action: `Created project "${name}"`,
        type: "project",
        userId: req.user!.userId,
        projectId: project.id,
      },
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", authorize("owner", "project_manager"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.location) updateData.location = data.location;
    if (data.status) updateData.status = data.status;
    if (data.progress !== undefined) updateData.progress = Number(data.progress);
    if (data.budget) updateData.budget = Number(data.budget);
    if (data.spent !== undefined) updateData.spent = Number(data.spent);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.description !== undefined) updateData.description = data.description;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    res.json({ project });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", authorize("owner"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    await prisma.project.delete({ where: { id } });

    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
