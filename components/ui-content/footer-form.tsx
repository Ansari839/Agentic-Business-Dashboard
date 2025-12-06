"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Plus, GripVertical } from "lucide-react";

interface FooterFormProps {
    initialData?: any[];
}

export function FooterForm({ initialData = [] }: FooterFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    // Ensure we work with an array even if old data was object
    const [sections, setSections] = useState(Array.isArray(initialData) ? initialData : []);

    const handleSectionTitleChange = (index: number, value: string) => {
        const newSections = [...sections];
        newSections[index] = { ...newSections[index], title: value };
        setSections(newSections);
    }

    const addSection = () => {
        setSections([...sections, { title: "New Section", links: [] }]);
    }

    const removeSection = (index: number) => {
        setSections(sections.filter((_, i) => i !== index));
    }

    const handleLinkChange = (sectionIndex: number, linkIndex: number, field: string, value: string) => {
        const newSections = [...sections];
        const newLinks = [...newSections[sectionIndex].links];
        newLinks[linkIndex] = { ...newLinks[linkIndex], [field]: value };
        newSections[sectionIndex].links = newLinks;
        setSections(newSections);
    }

    const addLink = (sectionIndex: number) => {
        const newSections = [...sections];
        newSections[sectionIndex].links.push({ label: "", href: "" });
        setSections(newSections);
    }

    const removeLink = (sectionIndex: number, linkIndex: number) => {
        const newSections = [...sections];
        newSections[sectionIndex].links = newSections[sectionIndex].links.filter((_: any, i: number) => i !== linkIndex);
        setSections(newSections);
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/ui-content/footer", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sections),
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

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-5xl">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Footer Sections</h3>
                <Button type="button" onClick={addSection}>
                    <Plus className="h-4 w-4 mr-2" /> Add Section
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section: any, sIndex: number) => (
                    <Card key={sIndex} className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-red-500 z-10"
                            onClick={() => removeSection(sIndex)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                        <CardHeader>
                            <div className="mr-8">
                                <Label>Section Title</Label>
                                <Input
                                    value={section.title}
                                    onChange={(e) => handleSectionTitleChange(sIndex, e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label>Links</Label>
                                    <Button type="button" size="sm" variant="outline" onClick={() => addLink(sIndex)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                    </Button>
                                </div>
                                {section.links.map((link: any, lIndex: number) => (
                                    <div key={lIndex} className="flex gap-2 items-center">
                                        <div className="space-y-1 flex-1">
                                            <Input
                                                placeholder="Label"
                                                value={link.label}
                                                onChange={(e) => handleLinkChange(sIndex, lIndex, 'label', e.target.value)}
                                                className="h-8 text-xs"
                                            />
                                            <Input
                                                placeholder="Link"
                                                value={link.href}
                                                onChange={(e) => handleLinkChange(sIndex, lIndex, 'href', e.target.value)}
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(sIndex, lIndex)}>
                                            <Trash className="h-3 w-3 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
