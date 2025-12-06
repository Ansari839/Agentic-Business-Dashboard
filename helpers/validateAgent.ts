import { z } from 'zod';
import { AgentType } from '@/constants/agentTypes';

// Config schema can vary, but we'll keep it flexible as an object for now
const configSchema = z.record(z.any()).optional();

export const createAgentSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.nativeEnum(AgentType, {
        errorMap: () => ({ message: 'Invalid agent type' }),
    }),
    enabled: z.boolean().default(true),
    config: configSchema,
});

export const updateAgentSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    type: z.nativeEnum(AgentType).optional(),
    enabled: z.boolean().optional(),
    config: configSchema,
});
