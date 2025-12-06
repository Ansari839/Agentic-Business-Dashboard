import { z } from 'zod';
import { InquiryStatus } from '@/constants/inquiries';

export const updateInquirySchema = z.object({
    status: z.nativeEnum(InquiryStatus).optional(),
    assignedToId: z.string().optional().nullable(), // Allow unassigning
    note: z.string().min(1).optional(), // For adding a single note
});

export const createInquirySchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    message: z.string().min(1, "Message is required"),
});
