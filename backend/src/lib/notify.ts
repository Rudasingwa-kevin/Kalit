import prisma from "./prisma.js";

export type NotificationType = "invite_accepted" | "invite_declined" | "invite_expired";

export async function createNotification(data: {
  recipientId: string;
  type: NotificationType;
  message: string;
  relatedUserId?: string;
}) {
  return prisma.notification.create({
    data: {
      recipientId: data.recipientId,
      type: data.type,
      message: data.message,
      relatedUserId: data.relatedUserId ?? null,
    },
  });
}
