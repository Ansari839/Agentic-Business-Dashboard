"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Package,
    MessageSquare,
    Palette,
    Bot,
    Settings,
    BarChart3
} from "lucide-react";

interface SidebarProps {
    role?: string;
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Products",
            icon: Package,
            href: "/dashboard/products",
            color: "text-violet-500",
        },
        {
            label: "Inquiries",
            icon: MessageSquare,
            href: "/dashboard/inquiries",
            color: "text-pink-700",
        },
        {
            label: "UI Editor",
            icon: Palette,
            href: "/dashboard/ui-content",
            color: "text-orange-700",
        },
        {
            label: "Agents",
            icon: Bot,
            href: "/dashboard/agents",
            color: "text-emerald-500",
            roles: ["ADMIN", "SUPERADMIN"], // Hidden for SALES if strict logic applies, or handled in page
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/dashboard/analytics",
            color: "text-blue-600",
            roles: ["ADMIN", "SUPERADMIN"],
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
        },
    ];

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold">
                        Admin Panel
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => {
                        // Role based filtering for sidebar items
                        if (route.roles && role && !route.roles.includes(role)) {
                            return null;
                        }

                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
