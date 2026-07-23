import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

// List tasks for a project
router.get("/project/:projectId", async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params as { projectId: string };
    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "asc" }],
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });
    res.json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single task
router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params as { id: string };
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json({ task });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create task
router.post("/", async (req: AuthRequest, res) => {
  try {
    const { title, description, projectId, assigneeId, priority, dueDate, status } = req.body;

    if (!title || !projectId || !assigneeId) {
      res.status(400).json({ error: "title, projectId, and assigneeId are required" });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId,
        priority: priority || "medium",
        status: status || "todo",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    // Update project task counts
    const totalTasks = await prisma.task.count({ where: { projectId } });
    const tasksCompleted = await prisma.task.count({ where: { projectId, status: "done" } });
    await prisma.project.update({
      where: { id: projectId },
      data: { totalTasks, tasksCompleted },
    });

    // Create activity
    await prisma.activity.create({
      data: {
        action: `Task created: ${title}`,
        type: "task",
        userId: req.user!.userId,
        projectId,
      },
    });

    res.status(201).json({ task });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update task
router.put("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params as { id: string };
    const { title, description, status, priority, assigneeId, dueDate } = req.body;

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        done: status === "done",
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    // Update project task counts
    const totalTasks = await prisma.task.count({ where: { projectId: existing.projectId } });
    const tasksCompleted = await prisma.task.count({ where: { projectId: existing.projectId, status: "done" } });
    await prisma.project.update({
      where: { id: existing.projectId },
      data: { totalTasks, tasksCompleted },
    });

    // Activity for status change
    if (status && status !== existing.status) {
      const action = status === "done" ? "completed" : status === "in_progress" ? "started" : "moved to todo";
      await prisma.activity.create({
        data: {
          action: `Task ${action}: ${task.title}`,
          type: "task",
          userId: req.user!.userId,
          projectId: existing.projectId,
        },
      });
    }

    res.json({ task });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete task
router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params as { id: string };

    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    await prisma.task.delete({ where: { id } });

    // Update project task counts
    const totalTasks = await prisma.task.count({ where: { projectId: existing.projectId } });
    const tasksCompleted = await prisma.task.count({ where: { projectId: existing.projectId, status: "done" } });
    await prisma.project.update({
      where: { id: existing.projectId },
      data: { totalTasks, tasksCompleted },
    });

    await prisma.activity.create({
      data: {
        action: `Task deleted: ${existing.title}`,
        type: "task",
        userId: req.user!.userId,
        projectId: existing.projectId,
      },
    });

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Bulk update task statuses (for drag-and-drop)
router.put("/bulk/update", async (req: AuthRequest, res) => {
  try {
    const { updates } = req.body;
    // updates: [{ id, status }]

    if (!Array.isArray(updates)) {
      res.status(400).json({ error: "updates must be an array" });
      return;
    }

    const projectIds = new Set<string>();

    for (const update of updates) {
      const existing = await prisma.task.findUnique({ where: { id: update.id } });
      if (!existing) continue;

      await prisma.task.update({
        where: { id: update.id },
        data: { status: update.status, done: update.status === "done" },
      });
      projectIds.add(existing.projectId);
    }

    // Update task counts for all affected projects
    for (const projectId of projectIds) {
      const totalTasks = await prisma.task.count({ where: { projectId } });
      const tasksCompleted = await prisma.task.count({ where: { projectId, status: "done" } });
      await prisma.project.update({
        where: { id: projectId },
        data: { totalTasks, tasksCompleted },
      });
    }

    res.json({ message: "Tasks updated" });
  } catch (error) {
    console.error("Bulk update tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
