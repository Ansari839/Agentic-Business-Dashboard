"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface PromosFormProps {
    initialData?: any;
}

export function PromosForm({ initialData }: PromosFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [promo, setPromo] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        bannerImage: initialData?.bannerImage || "",
        buttonText: initialData?.buttonText || "",
        buttonLink: initialData?.buttonLink || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPromo((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/ui-content/promos", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(promo),
            });

            if (!res.ok) throw new Error("Failed to update");
            router.refresh();
            alert("Promos updated successfully!");
        } catch (error) {
            alert("Error updating promos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
            <Card>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                        <Label>Promo Title</Label>
                        <Input
                            name="title"
                            value={promo.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            value={promo.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Banner Image URL</Label>
                        <Input
                            name="bannerImage"
                            value={promo.bannerImage}
                            onChange={handleChange}
                            placeholder="https://..."
                            required
                        />
                        {promo.bannerImage && (
                            <img src={promo.bannerImage} alt="Banner Preview" className="h-40 w-full object-cover rounded mt-2 border" />
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Button Text</Label>
                        <Input
                            name="buttonText"
                            value={promo.buttonText}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Button Link</Label>
                        <Input
                            name="buttonLink"
                            value={promo.buttonLink}
                            onChange={handleChange}
                            required
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
