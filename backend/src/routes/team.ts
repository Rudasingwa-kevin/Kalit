import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { authenticate, authorize, type AuthRequest } from "../middleware/auth.js";

const router = Router();

function generateInvitationCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "KLT-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

router.get("/members", authenticate, async (req: AuthRequest, res) => {
  try {
    const { search, role } = req.query;

    const where: any = {};

    if (search && typeof search === "string") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && typeof role === "string" && role !== "all") {
      where.role = role;
    }

    const members = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        joinedAt: true,
        invitedBy: true,
        avatar: true,
      },
      orderBy: { joinedAt: "desc" },
    });

    res.json({ members });
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/members/:id", authorize("owner"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    if (id === req.user!.userId) {
      res.status(400).json({ error: "Cannot remove yourself" });
      return;
    }

    const member = await prisma.user.findUnique({ where: { id } });
    if (!member) {
      res.status(404).json({ error: "Member not found" });
      return;
    }

    if (member.role === "owner") {
      res.status(403).json({ error: "Cannot remove an owner" });
      return;
    }

    await prisma.user.update({
      where: { id },
      data: { status: "inactive" },
    });

    res.json({ message: "Member removed" });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/invitations", authenticate, async (req: AuthRequest, res) => {
  try {
    const invitations = await prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ invitations });
  } catch (error) {
    console.error("Get invitations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/invitations", authorize("owner"), async (req: AuthRequest, res) => {
  try {
    const { name, phone, role, message } = req.body;

    if (!name || !phone || !role) {
      res.status(400).json({ error: "Name, phone, and role are required" });
      return;
    }

    let code = generateInvitationCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.invitation.findUnique({ where: { code } });
      if (!existing) break;
      code = generateInvitationCode();
      attempts++;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.invitation.create({
      data: {
        name,
        phone,
        role,
        message: message || "",
        code,
        expiresAt,
        invitedBy: req.user!.userId,
      },
    });

    res.status(201).json({ invitation });
  } catch (error) {
    console.error("Create invitation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/invitations/:id", authorize("owner"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const invitation = await prisma.invitation.findUnique({ where: { id } });
    if (!invitation) {
      res.status(404).json({ error: "Invitation not found" });
      return;
    }

    await prisma.invitation.delete({ where: { id } });

    res.json({ message: "Invitation revoked" });
  } catch (error) {
    console.error("Revoke invitation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/invitations/verify/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const invitation = await prisma.invitation.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!invitation) {
      res.status(404).json({ error: "Invalid invitation code" });
      return;
    }

    if (invitation.status !== "pending") {
      res.status(400).json({ error: "Invitation is no longer valid" });
      return;
    }

    if (new Date() > invitation.expiresAt) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "expired" },
      });
      res.status(400).json({ error: "Invitation has expired" });
      return;
    }

    res.json({
      valid: true,
      invitation: {
        name: invitation.name,
        role: invitation.role,
        code: invitation.code,
      },
    });
  } catch (error) {
    console.error("Verify invitation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/join", async (req, res) => {
  try {
    const { code, name, email } = req.body;

    if (!code || !name || !email) {
      res.status(400).json({ error: "Code, name, and email are required" });
      return;
    }

    const invitation = await prisma.invitation.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!invitation) {
      res.status(404).json({ error: "Invalid invitation code" });
      return;
    }

    if (invitation.status !== "pending") {
      res.status(400).json({ error: "Invitation is no longer valid" });
      return;
    }

    if (new Date() > invitation.expiresAt) {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: "expired" },
      });
      res.status(400).json({ error: "Invitation has expired" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: invitation.code,
        role: invitation.role,
        phone: invitation.phone,
        status: "active",
        invitedBy: invitation.invitedBy,
      },
    });

    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "accepted" },
    });

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: invitation.code,
      },
    });
  } catch (error) {
    console.error("Join error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
