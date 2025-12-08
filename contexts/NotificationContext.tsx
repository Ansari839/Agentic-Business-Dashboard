"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { NotificationType } from "@/constants/notificationTypes";

interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    read: boolean;
    createdAt: string;
    metadata?: any;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch initial notifications
    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            const data = await res.json();
            if (Array.isArray(data)) {
                setNotifications(data);
                setUnreadCount(data.filter((n) => !n.read).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Initialize Pusher Client
        // Note: In production, these keys should be env vars accessible to client (NEXT_PUBLIC_...)
        // For now, consistent with plan, using placeholders or assume env vars are present.
        const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || "PUSHER_KEY_PLACEHOLDER";
        const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1";

        if (pusherKey === "PUSHER_KEY_PLACEHOLDER") {
            console.warn("Pusher key not found. Real-time notifications disabled.");
            return;
        }

        const pusher = new Pusher(pusherKey, {
            cluster: pusherCluster,
        });

        // Subscribe to channel
        // For simple admin dashboard, we can use a global 'admin-notifications' channel
        const channel = pusher.subscribe("admin-notifications");

        channel.bind("notification:new", (data: Notification) => {
            setNotifications((prev) => [data, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // Optional: Add browser notification logic here if desired
        });

        return () => {
            pusher.unsubscribe("admin-notifications");
        };
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}`, { method: "PUT" });
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
