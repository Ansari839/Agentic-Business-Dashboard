"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
// Assuming we might move logout to a server action later, but for now simple form post to API
// implementation from /app/admin/dashboard/page.tsx was <form action="/api/auth/logout" method="POST">

interface HeaderProps {
    user: {
        name?: string | null;
        email?: string | null;
        role?: string;
    };
}

export function Header({ user }: HeaderProps) {
    return (
        <div className="border-b shadow-sm z-10 w-full bg-white dark:bg-slate-950 p-4 flex items-center justify-between h-16">
            <div className="font-semibold text-lg md:hidden">
                {/* Mobile menu trigger could go here */}
                Admin Panel
            </div>
            <div className="flex items-center gap-x-4 ml-auto">
                <div className="flex flex-col items-end mr-4">
                    <span className="text-sm font-medium">{user.name || user.email}</span>
                    <span className="text-xs text-muted-foreground">{user.role}</span>
                </div>
                <form action="/api/auth/logout" method="POST">
                    <Button variant="ghost" size="icon" type="submit" title="Logout">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
