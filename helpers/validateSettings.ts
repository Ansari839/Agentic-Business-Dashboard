import { z } from 'zod';

export const updateEmployeeSchema = z.object({
    role: z.enum(["ADMIN", "SALES", "SUPERADMIN"]).optional(),
    isActive: z.boolean().optional(),
    apiLimits: z.record(z.number()).optional(),
    featureFlags: z.record(z.boolean()).optional(),
});

export const updateFeatureSchema = z.object({
    isEnabled: z.boolean(),
});
