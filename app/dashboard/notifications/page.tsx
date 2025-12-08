"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Check, Mail, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationType } from "@/constants/notificationTypes";

export default function NotificationsPage() {
    const { notifications, markAsRead } = useNotifications();

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.INQUIRY:
                return <MessageSquare className="h-5 w-5 text-blue-500" />;
            case NotificationType.AGENT_COMPLETE:
                return <Check className="h-5 w-5 text-green-500" />;
            case NotificationType.AGENT_ERROR:
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Mail className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    {notifications.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No notifications found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start justify-between p-4 rounded-lg border ${!notification.read ? "bg-accent/50 border-blue-200 dark:border-blue-800" : "bg-card"
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium leading-none">
                                                {notification.message}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    {!notification.read && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => markAsRead(notification.id)}
                                            className="ml-auto"
                                        >
                                            Mark as read
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
