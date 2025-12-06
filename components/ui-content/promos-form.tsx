"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Plus } from "lucide-react";

interface PromosFormProps {
    initialData?: any[];
}

export function PromosForm({ initialData = [] }: PromosFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    // Ensure array
    const [promos, setPromos] = useState(Array.isArray(initialData) ? initialData : []);

    const handleChange = (index: number, field: string, value: string | boolean) => {
        const newPromos = [...promos];
        newPromos[index] = { ...newPromos[index], [field]: value };
        setPromos(newPromos);
    };

    const addPromo = () => {
        setPromos([...promos, {
            title: "New Promo",
            description: "",
            bannerImage: "",
            buttonText: "Shop Now",
            buttonLink: "",
            active: true
        }]);
    }

    const removePromo = (index: number) => {
        setPromos(promos.filter((_, i) => i !== index));
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/ui-content/promos", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(promos),
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
            <div className="flex justify-end">
                <Button type="button" onClick={addPromo}>
                    <Plus className="h-4 w-4 mr-2" /> Add Promo
                </Button>
            </div>

            <div className="space-y-6">
                {promos.map((promo: any, index: number) => (
                    <Card key={index} className={`relative ${!promo.active ? 'opacity-60 grayscale' : ''}`}>
                        <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                                type="button"
                                variant={promo.active ? "default" : "secondary"}
                                size="sm"
                                onClick={() => handleChange(index, 'active', !promo.active)}
                            >
                                {promo.active ? "Active" : "Inactive"}
                            </Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removePromo(index)}>
                                <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>

                        <CardContent className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <Label>Promo Title</Label>
                                <Input
                                    value={promo.title}
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={promo.description}
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label>Banner Image URL</Label>
                                <Input
                                    value={promo.bannerImage}
                                    onChange={(e) => handleChange(index, 'bannerImage', e.target.value)}
                                    placeholder="https://..."
                                />
                                {promo.bannerImage && (
                                    <img src={promo.bannerImage} alt="Preview" className="h-40 w-full object-cover rounded mt-2 border" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Button Text</Label>
                                <Input
                                    value={promo.buttonText}
                                    onChange={(e) => handleChange(index, 'buttonText', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Button Link</Label>
                                <Input
                                    value={promo.buttonLink}
                                    onChange={(e) => handleChange(index, 'buttonLink', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {promos.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">No promos added yet.</div>
                )}
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
