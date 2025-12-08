import prisma from "@/lib/prisma";
import Pusher from "pusher";
import { NotificationType } from "@/constants/notificationTypes";
import { formatNotificationMessage } from "@/helpers/formatMessage";

// Initialize Pusher (Use environment variables)
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
});

interface CreateNotificationDTO {
    type: NotificationType;
    data: any; // Dynamic data mostly for message formatting
    userId?: string; // Optional specific user target
    metadata?: any;
}

export class NotificationService {
    static async createNotification(payload: CreateNotificationDTO) {
        const message = formatNotificationMessage(payload.type, payload.data);

        // 1. Save to Database
        const notification = await prisma.notification.create({
            data: {
                type: payload.type,
                message: message,
                userId: payload.userId,
                metadata: payload.metadata || payload.data, // Store data as metadata if not explicitly provided
            },
        });

        // 2. Trigger Real-time Event
        // If userId is present, we could send to a private channel 'private-user-ID'
        // For now, let's assume a general 'admin-notifications' channel for all admins, 
        // or a specific channel logic.
        const channel = payload.userId ? `private-user-${payload.userId}` : "admin-notifications";

        try {
            await pusher.trigger(channel, "notification:new", notification);
        } catch (error) {
            console.error("Pusher Trigger Error:", error);
            // Don't fail the request if Pusher fails, just log it.
        }

        // 3. Optional: Trigger Email (Stub)
        if (payload.type === NotificationType.AGENT_ERROR) {
            // await EmailService.sendAdminAlert(...)
        }

        return notification;
    }

    static async getUnreadNotifications(userId?: string) {
        // If userId provided, get global + specific user notifications
        // If not, get all (assuming all admins see all for now, or refine logic)

        const whereClause: any = {
            read: false,
        };

        if (userId) {
            whereClause.OR = [
                { userId: null }, // Global notifications
                { userId: userId }
            ];
        }

        return await prisma.notification.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            take: 50, // Limit to recent 50 unread
        });
    }

    static async getAllNotifications(userId?: string) {
        const whereClause: any = {};
        if (userId) {
            whereClause.OR = [
                { userId: null },
                { userId: userId }
            ];
        }
        return await prisma.notification.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            take: 100,
        });
    }

    static async markAsRead(id: string) {
        return await prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }

    static async markAllAsRead(userId?: string) {
        // Careful with marking global notifications as read for everyone.
        // For simplicity now, let's just mark user specific ones or all if global context.
        // A better approach often involves a "UserReadNotification" join table.
        // For this MVP, we'll just update where we can.

        const whereClause: any = { read: false };
        if (userId) {
            whereClause.userId = userId;
        }

        return await prisma.notification.updateMany({
            where: whereClause,
            data: { read: true },
        });
    }
}
