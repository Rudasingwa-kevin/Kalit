import { Router } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import prisma from "../lib/prisma.js";
import { generateToken } from "../lib/jwt.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { sendEmail, buildResetPasswordEmail } from "../lib/email.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, company, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        company: company || null,
        password: hashedPassword,
        role: "owner",
        status: "active",
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    if (user.status !== "active") {
      res.status(403).json({ error: "Account is not active" });
      return;
    }

    const isKltCode = /^KLT-[A-Z0-9]{4}$/i.test(password);
    let validPassword = false;

    if (isKltCode) {
      validPassword = user.password === password;
    } else {
      validPassword = await bcrypt.compare(password, user.password);
    }

    if (!validPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        company: true,
        joinedAt: true,
        avatar: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { name, phone, company } = req.body;

    const updateData: Record<string, string | null> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone || null;
    if (company !== undefined) updateData.company = company || null;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        company: true,
        joinedAt: true,
        avatar: true,
      },
    });

    res.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/password", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Current password and new password are required" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isKltCode = /^KLT-[A-Z0-9]{4}$/i.test(currentPassword);
    let validPassword = false;

    if (isKltCode) {
      validPassword = user.password === currentPassword;
    } else {
      validPassword = await bcrypt.compare(currentPassword, user.password);
    }

    if (!validPassword) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, used: false },
      });

      await prisma.passwordResetToken.create({
        data: {
          token: hashedToken,
          expiresAt,
          userId: user.id,
        },
      });

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;
      const { subject, html } = buildResetPasswordEmail(resetLink);

      await sendEmail({ to: user.email, subject, html });
    }

    res.json({ message: "If an account exists with this email, a reset link has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ error: "Token and new password are required" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      res.status(400).json({ error: "Invalid or expired reset token" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
