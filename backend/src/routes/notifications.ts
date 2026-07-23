import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        relatedUser: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    const unreadCount = await prisma.notification.count({
      where: { recipientId: userId, read: false },
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/read", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    await prisma.notification.updateMany({
      where: { recipientId: userId, read: false },
      data: { read: true },
    });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark notifications read error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/read", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params as { id: string };
    const userId = req.user!.userId;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.recipientId !== userId) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
