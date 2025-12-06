"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming I check components later, I'll use standard textarea if missing
import { Checkbox } from "@/components/ui/checkbox"; // Need to check if I have checkbox
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSlug } from "@/helpers/formatSlug";

// Basic Checkbox if not present in components/ui, but likely is or easily mocked
// I'll check components/ui first or just define a simple one here or use native input type="checkbox" wrapped.
// Actually standard shadcn has Checkbox. I'll inspect components/ui later.
// For now I'll use native input type="checkbox" styled with tailwind for simplicity if I'm unsure.

interface ProductFormProps {
    initialData?: any;
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        specs: "{}",
        featured: false,
        showOnHome: false,
        metaSEO: "{}",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                slug: initialData.slug || "",
                description: initialData.description || "",
                specs: JSON.stringify(initialData.specs || {}, null, 2),
                featured: initialData.featured || false,
                showOnHome: initialData.showOnHome || false,
                metaSEO: JSON.stringify(initialData.metaSEO || {}, null, 2),
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));

            // Auto-generate slug from title
            if (name === 'title' && !initialData) {
                setFormData(prev => ({ ...prev, slug: formatSlug(value), [name]: value }));
            }
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, slug: formatSlug(e.target.value) }));
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const url = initialData ? `/api/products/${initialData.id}` : '/api/products';
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    specs: JSON.parse(formData.specs),
                    metaSEO: JSON.parse(formData.metaSEO),
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            router.push('/dashboard/products');
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{initialData ? "Edit Product" : "Create Product"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" name="slug" value={formData.slug} onChange={handleSlugChange} required />
                        <p className="text-xs text-muted-foreground">Auto-generated from title</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="specs">Specs (JSON)</Label>
                            <textarea
                                id="specs"
                                name="specs"
                                className="flex min-h-[150px] w-full font-mono rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                                value={formData.specs}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="metaSEO">Meta SEO (JSON)</Label>
                            <textarea
                                id="metaSEO"
                                name="metaSEO"
                                className="flex min-h-[150px] w-full font-mono rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                                value={formData.metaSEO}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex space-x-6">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="featured"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="featured">Featured</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="showOnHome"
                                name="showOnHome"
                                checked={formData.showOnHome}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="showOnHome">Show On Home</Label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (initialData ? "Update Product" : "Create Product")}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
