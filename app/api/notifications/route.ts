import { NotificationController } from "@/controllers/notification.controller";

export async function GET(request: Request) {
    return NotificationController.getUnread(request);
}

export async function POST(request: Request) {
    return NotificationController.create(request);
}
