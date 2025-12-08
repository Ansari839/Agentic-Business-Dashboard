import { NotificationType } from "@/constants/notificationTypes";

export function formatNotificationMessage(type: NotificationType, data: any): string {
    switch (type) {
        case NotificationType.INQUIRY:
            return `New inquiry from ${data.name || "Unknown"}`;
        case NotificationType.AGENT_COMPLETE:
            return `Agent ${data.agentName} has completed its task successfully.`;
        case NotificationType.AGENT_ERROR:
            return `Error reported by Agent ${data.agentName}: ${data.error || "Unknown error"}`;
        default:
            return "New notification received.";
    }
}
