"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Plus } from "lucide-react";

interface HeaderFormProps {
    initialData?: any;
}

export function HeaderForm({ initialData }: HeaderFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        logoText: initialData?.logoText || "",
        ctaLabel: initialData?.ctaLabel || "",
        ctaLink: initialData?.ctaLink || "",
        menuItems: initialData?.menuItems || [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMenuChange = (index: number, field: string, value: string) => {
        const newItems = [...formData.menuItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData((prev) => ({ ...prev, menuItems: newItems }));
    };

    const addMenuItem = () => {
        setFormData((prev) => ({
            ...prev,
            menuItems: [...prev.menuItems, { label: "", href: "" }],
        }));
    };

    const removeMenuItem = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            menuItems: prev.menuItems.filter((_, i) => i !== index),
        }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/ui-content/header", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update");
            router.refresh();
            alert("Header updated successfully!");
        } catch (error) {
            alert("Error updating header");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Logo Text</Label>
                        <Input
                            name="logoText"
                            value={formData.logoText}
                            onChange={handleChange}
                            placeholder="Brand Name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>CTA Label</Label>
                            <Input
                                name="ctaLabel"
                                value={formData.ctaLabel}
                                onChange={handleChange}
                                placeholder="Get Started"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>CTA Link</Label>
                            <Input
                                name="ctaLink"
                                value={formData.ctaLink}
                                onChange={handleChange}
                                placeholder="/signup"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">Menu Items</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addMenuItem}>
                            <Plus className="h-4 w-4 mr-2" /> Add Item
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {formData.menuItems.map((item: any, index: number) => (
                            <div key={index} className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <Label>Label</Label>
                                    <Input
                                        value={item.label}
                                        onChange={(e) => handleMenuChange(index, "label", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>Link</Label>
                                    <Input
                                        value={item.href}
                                        onChange={(e) => handleMenuChange(index, "href", e.target.value)}
                                        required
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="mb-0.5"
                                    onClick={() => removeMenuItem(index)}
                                >
                                    <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
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
