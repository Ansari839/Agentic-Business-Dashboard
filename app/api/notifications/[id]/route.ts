import { NotificationController } from "@/controllers/notification.controller";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    return NotificationController.markRead(request, context);
}
