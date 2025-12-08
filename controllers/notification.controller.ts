import { NextResponse } from "next/server";
import { NotificationService } from "@/services/notification.service";
import { NotificationType } from "@/constants/notificationTypes";

export class NotificationController {
    static async create(req: Request) {
        try {
            const body = await req.json();

            // Basic validation
            if (!body.type || !Object.values(NotificationType).includes(body.type)) {
                return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
            }

            const notification = await NotificationService.createNotification({
                type: body.type,
                data: body.data || {},
                userId: body.userId,
                metadata: body.metadata,
            });

            return NextResponse.json(notification, { status: 201 });
        } catch (error) {
            console.error("Create Notification Error:", error);
            return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
        }
    }

    static async getUnread(req: Request) {
        try {
            // In a real app, retrieve current user from session/token
            // const session = await getServerSession();
            // const userId = session?.user?.id;
            const userId = undefined; // Placeholder

            const notifications = await NotificationService.getUnreadNotifications(userId);
            return NextResponse.json(notifications);
        } catch (error) {
            console.error("Get Unread Notifications Error:", error);
            return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
        }
    }

    static async markRead(req: Request, { params }: { params: Promise<{ id: string }> }) {
        try {
            // Await the params
            const { id } = await params;
            const updated = await NotificationService.markAsRead(id);
            return NextResponse.json(updated);
        } catch (error) {
            console.error("Mark Read Error:", error);
            return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
        }
    }
}
