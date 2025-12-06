import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { LayoutTemplate, Image, Menu, Megaphone } from "lucide-react";

const sections = [
    {
        title: "Header & Navigation",
        description: "Manage logo, menu items, and CTA button.",
        href: "/dashboard/ui-content/header",
        icon: Menu,
    },
    {
        title: "Hero Sliders",
        description: "Manage homepage hero sliders and banners.",
        href: "/dashboard/ui-content/sliders",
        icon: Image,
    },
    {
        title: "Footer Content",
        description: "Update footer links, columns, and contact info.",
        href: "/dashboard/ui-content/footer",
        icon: LayoutTemplate,
    },
    {
        title: "Promos & Banners",
        description: "Manage promotional banners and sale alerts.",
        href: "/dashboard/ui-content/promos",
        icon: Megaphone,
    },
];

export default function UiContentOverview() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">UI Content Manager</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {sections.map((section) => (
                    <Link key={section.title} href={section.href}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {section.title}
                                </CardTitle>
                                <section.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    {section.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
