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

router.get("/users/search", authenticate, async (req: AuthRequest, res) => {
  try {
    const { email } = req.query;
    const teamOwnerId = req.user!.userId;

    if (!email || typeof email !== "string" || email.length < 2) {
      res.json({ users: [] });
      return;
    }

    const existingMemberUserIds = await prisma.teamMember.findMany({
      where: { teamOwnerId },
      select: { userId: true },
    });
    const idsToExclude = [teamOwnerId, ...existingMemberUserIds.map((m) => m.userId)];

    const users = await prisma.user.findMany({
      where: {
        email: { contains: email, mode: "insensitive" },
        id: { notIn: idsToExclude },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
      },
      take: 5,
    });

    res.json({ users });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/members", authorize("owner"), async (req: AuthRequest, res) => {
  try {
    const { userId, role } = req.body;
    const teamOwnerId = req.user!.userId;

    if (!userId || !role) {
      res.status(400).json({ error: "User ID and role are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const existing = await prisma.teamMember.findUnique({
      where: { userId_teamOwnerId: { userId, teamOwnerId } },
    });
    if (existing) {
      res.status(409).json({ error: "User is already a member of your team" });
      return;
    }

    const member = await prisma.teamMember.create({
      data: {
        userId,
        teamOwnerId,
        role,
        status: "active",
      },
    });

    res.status(201).json({
      member: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        teamRole: member.role,
        teamStatus: member.status,
        joinedAt: member.joinedAt,
      },
    });
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/members", authenticate, async (req: AuthRequest, res) => {
  try {
    const { search, role } = req.query;
    const teamOwnerId = req.user!.userId;

    const where: any = {
      teamOwnerId,
    };

    if (search && typeof search === "string") {
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    if (role && typeof role === "string" && role !== "all") {
      where.role = role;
    }

    const teamMembers = await prisma.teamMember.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const owner = await prisma.user.findUnique({
      where: { id: teamOwnerId },
      select: { id: true, name: true, email: true, phone: true, avatar: true, role: true, joinedAt: true },
    });

    const members = [
      ...(owner ? [{
        ...owner,
        teamRole: "owner",
        teamStatus: "active",
        joinedAt: owner.joinedAt,
      }] : []),
      ...teamMembers.map((tm) => ({
        ...tm.user,
        teamRole: tm.role,
        teamStatus: tm.status,
        joinedAt: tm.joinedAt,
      })),
    ];

    res.json({ members });
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/members/:id", authorize("owner"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const teamOwnerId = req.user!.userId;

    if (id === teamOwnerId) {
      res.status(400).json({ error: "Cannot remove yourself" });
      return;
    }

    const teamMember = await prisma.teamMember.findUnique({
      where: { userId_teamOwnerId: { userId: id, teamOwnerId } },
    });

    if (!teamMember) {
      res.status(404).json({ error: "Member not found in your team" });
      return;
    }

    await prisma.teamMember.delete({
      where: { userId_teamOwnerId: { userId: id, teamOwnerId } },
    });

    res.json({ message: "Member removed from team" });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/invitations", authenticate, async (req: AuthRequest, res) => {
  try {
    const invitations = await prisma.invitation.findMany({
      where: { invitedBy: req.user!.userId },
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

    if (invitation.invitedBy !== req.user!.userId) {
      res.status(403).json({ error: "Not your invitation" });
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

    const teamOwner = await prisma.user.findUnique({
      where: { id: invitation.invitedBy },
      select: { name: true },
    });

    res.json({
      valid: true,
      invitation: {
        name: invitation.name,
        role: invitation.role,
        code: invitation.code,
        teamOwnerName: teamOwner?.name || "Unknown",
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

    const teamOwnerId = invitation.invitedBy;

    const existingMembership = await prisma.teamMember.findUnique({
      where: { userId_teamOwnerId: { userId: "", teamOwnerId } },
    }).catch(() => null);

    let user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (user) {
      const alreadyInTeam = await prisma.teamMember.findUnique({
        where: { userId_teamOwnerId: { userId: user.id, teamOwnerId } },
      });

      if (alreadyInTeam) {
        res.status(409).json({ error: "You are already a member of this team" });
        return;
      }

      await prisma.teamMember.create({
        data: {
          userId: user.id,
          teamOwnerId,
          role: invitation.role,
          status: "active",
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: invitation.code,
          role: invitation.role,
          phone: invitation.phone,
          status: "active",
          invitedBy: teamOwnerId,
        },
      });

      await prisma.teamMember.create({
        data: {
          userId: user.id,
          teamOwnerId,
          role: invitation.role,
          status: "active",
        },
      });
    }

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
      },
    });
  } catch (error) {
    console.error("Join error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
