import { z } from 'zod';

// Reusable
const linkSchema = z.object({
    label: z.string().min(1, "Label is required"),
    href: z.string().min(1, "Link is required"),
});

// Header
export const headerSchema = z.object({
    menuItems: z.array(linkSchema),
    ctaLabel: z.string().optional(),
    ctaLink: z.string().optional(),
    logoText: z.string().optional(), // Or logoUrl
});

// Slider
export const sliderItemSchema = z.object({
    image: z.string().url("Invalid image URL"),
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().optional(),
    link: z.string().optional(),
    order: z.number().default(0),
});

export const slidersSchema = z.array(sliderItemSchema);

// Footer
export const footerColumnSchema = z.object({
    title: z.string(),
    links: z.array(linkSchema),
});

export const footerSchema = z.object({
    column1: footerColumnSchema,
    column2: footerColumnSchema,
    contactInfo: z.object({
        address: z.string(),
        email: z.string().email(),
        phone: z.string(),
    })
});

// Promos
export const promoSchema = z.object({
    title: z.string(),
    description: z.string(),
    bannerImage: z.string().url(),
    buttonText: z.string(),
    buttonLink: z.string(),
});
