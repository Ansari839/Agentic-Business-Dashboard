"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Plus, GripVertical } from "lucide-react";

interface SlidersFormProps {
    initialData?: any[];
}

export function SlidersForm({ initialData = [] }: SlidersFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [sliders, setSliders] = useState(initialData);

    const handleChange = (index: number, field: string, value: string | number) => {
        const newSliders = [...sliders];
        newSliders[index] = { ...newSliders[index], [field]: value };
        setSliders(newSliders);
    };

    const addSlider = () => {
        setSliders([
            ...sliders,
            { image: "", title: "", subtitle: "", link: "", order: sliders.length },
        ]);
    };

    const removeSlider = (index: number) => {
        setSliders(sliders.filter((_, i) => i !== index));
    };

    const moveSlider = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === sliders.length - 1) return;

        const newSliders = [...sliders];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        [newSliders[index], newSliders[targetIndex]] = [newSliders[targetIndex], newSliders[index]];

        // Update order
        newSliders.forEach((s, i) => s.order = i);
        setSliders(newSliders);
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/ui-content/sliders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sliders),
            });

            if (!res.ok) throw new Error("Failed to update");
            router.refresh();
            alert("Sliders updated successfully!");
        } catch (error) {
            alert("Error updating sliders");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
            <div className="flex justify-end">
                <Button type="button" onClick={addSlider}>
                    <Plus className="h-4 w-4 mr-2" /> Add Slider
                </Button>
            </div>

            <div className="space-y-4">
                {sliders.map((slider: any, index: number) => (
                    <Card key={index} className="relative">
                        <CardContent className="pt-6 grid grid-cols-12 gap-4">
                            <div className="col-span-1 flex flex-col justify-center items-center gap-2">
                                <Button type="button" variant="ghost" size="icon" onClick={() => moveSlider(index, 'up')} disabled={index === 0}>
                                    <GripVertical className="h-4 w-4 rotate-90" />
                                </Button>
                                <span className="text-xs text-muted-foreground">{index + 1}</span>
                                <Button type="button" variant="ghost" size="icon" onClick={() => moveSlider(index, 'down')} disabled={index === sliders.length - 1}>
                                    <GripVertical className="h-4 w-4 rotate-90" />
                                </Button>
                            </div>

                            <div className="col-span-11 grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <Label>Image URL</Label>
                                    <Input
                                        value={slider.image}
                                        onChange={(e) => handleChange(index, "image", e.target.value)}
                                        placeholder="https://..."
                                        required
                                    />
                                    {slider.image && (
                                        <img src={slider.image} alt="Preview" className="h-20 w-auto object-cover rounded mt-2 border" />
                                    )}
                                </div>

                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <Label>Title</Label>
                                    <Input
                                        value={slider.title}
                                        onChange={(e) => handleChange(index, "title", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <Label>Subtitle (Optional)</Label>
                                    <Input
                                        value={slider.subtitle || ""}
                                        onChange={(e) => handleChange(index, "subtitle", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <Label>Link (Optional)</Label>
                                    <Input
                                        value={slider.link || ""}
                                        onChange={(e) => handleChange(index, "link", e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-red-500"
                                onClick={() => removeSlider(index)}
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {sliders.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">No sliders added yet.</div>
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
