import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession() as { role?: string; email?: string; name?: string } | null;

    if (!session) {
        redirect("/login");
    }

    // Basic role check if needed, but middleware handles broadly. 
    // Detailed RBAC can be per-page or passed to sidebar/header.

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar role={session.role} />
            </div>
            <main className="md:pl-72 h-full">
                <Header user={session} />
                <div className="h-full p-8 pt-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
