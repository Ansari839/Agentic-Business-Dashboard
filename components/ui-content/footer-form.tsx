"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Plus } from "lucide-react";

interface FooterFormProps {
    initialData?: any;
}

export function FooterForm({ initialData }: FooterFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [footer, setFooter] = useState({
        column1: initialData?.column1 || { title: "", links: [] },
        column2: initialData?.column2 || { title: "", links: [] },
        contactInfo: initialData?.contactInfo || { address: "", email: "", phone: "" },
    });

    const handleContactChange = (field: string, value: string) => {
        setFooter(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, [field]: value } }));
    }

    const handleColumnTitleChange = (column: 'column1' | 'column2', value: string) => {
        setFooter(prev => ({ ...prev, [column]: { ...prev[column], title: value } }));
    }

    const handleLinkChange = (column: 'column1' | 'column2', index: number, field: string, value: string) => {
        const newLinks = [...footer[column].links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setFooter(prev => ({ ...prev, [column]: { ...prev[column], links: newLinks } }));
    }

    const addLink = (column: 'column1' | 'column2') => {
        setFooter(prev => ({
            ...prev,
            [column]: { ...prev[column], links: [...prev[column].links, { label: "", href: "" }] }
        }));
    }

    const removeLink = (column: 'column1' | 'column2', index: number) => {
        setFooter(prev => ({
            ...prev,
            [column]: { ...prev[column], links: prev[column].links.filter((_, i) => i !== index) }
        }));
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/ui-content/footer", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(footer),
            });

            if (!res.ok) throw new Error("Failed to update");
            router.refresh();
            alert("Footer updated successfully!");
        } catch (error) {
            alert("Error updating footer");
        } finally {
            setLoading(false);
        }
    };

    const renderColumnEditor = (columnKey: 'column1' | 'column2', label: string) => (
        <Card>
            <CardHeader>
                <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                        value={footer[columnKey].title}
                        onChange={(e) => handleColumnTitleChange(columnKey, e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label>Links</Label>
                        <Button type="button" size="sm" variant="outline" onClick={() => addLink(columnKey)}>
                            <Plus className="h-4 w-4 mr-2" /> Add
                        </Button>
                    </div>
                    {footer[columnKey].links.map((link: any, i: number) => (
                        <div key={i} className="flex gap-2 items-center">
                            <Input
                                placeholder="Label"
                                value={link.label}
                                onChange={(e) => handleLinkChange(columnKey, i, 'label', e.target.value)}
                            />
                            <Input
                                placeholder="Link"
                                value={link.href}
                                onChange={(e) => handleLinkChange(columnKey, i, 'href', e.target.value)}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(columnKey, i)}>
                                <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderColumnEditor('column1', 'Column 1')}
                {renderColumnEditor('column2', 'Column 2')}
            </div>

            <Card>
                <CardHeader><CardTitle>Contact Info</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                            value={footer.contactInfo.address}
                            onChange={(e) => handleContactChange('address', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            value={footer.contactInfo.email}
                            onChange={(e) => handleContactChange('email', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            value={footer.contactInfo.phone}
                            onChange={(e) => handleContactChange('phone', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
