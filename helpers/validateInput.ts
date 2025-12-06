import { z } from 'zod';

// Helper to validate JSON string
const jsonString = z.string().refine((val) => {
    try {
        JSON.parse(val);
        return true;
    } catch {
        return false;
    }
}, {
    message: "Invalid JSON format",
});

export const productSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    specs: jsonString.or(z.record(z.any())).transform(val => {
        if (typeof val === 'string') return JSON.parse(val);
        return val;
    }),
    featured: z.boolean().default(false),
    showOnHome: z.boolean().default(false),
    metaSEO: jsonString.or(z.record(z.any())).optional().transform(val => {
        if (typeof val === 'string') return JSON.parse(val);
        return val || {};
    }),
});
