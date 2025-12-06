import prisma from "@/lib/prisma";
import { AgentType } from "@/constants/agentTypes";
import { Prisma } from "@prisma/client";

export const getAgents = async () => {
    return await prisma.agent.findMany({
        orderBy: { createdAt: "desc" },
    });
};

export const getAgentById = async (id: string) => {
    return await prisma.agent.findUnique({
        where: { id },
    });
};

export const createAgent = async (data: {
    name: string;
    type: AgentType;
    enabled?: boolean;
    config?: any;
}) => {
    return await prisma.agent.create({
        data: {
            name: data.name,
            type: data.type,
            enabled: data.enabled ?? true,
            config: data.config ?? {},
            logs: [],
        },
    });
};

export const updateAgent = async (id: string, data: {
    name?: string;
    type?: AgentType;
    enabled?: boolean;
    config?: any;
}) => {
    return await prisma.agent.update({
        where: { id },
        data,
    });
};

export const deleteAgent = async (id: string) => {
    return await prisma.agent.delete({
        where: { id },
    });
};

export const runAgent = async (id: string) => {
    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new Error("Agent not found");

    if (!agent.enabled) {
        throw new Error("Agent is disabled");
    }

    // SIMULATION: Perform action based on type
    // In a real app, this would call external APIs or background jobs
    const logEntry = {
        timestamp: new Date().toISOString(),
        status: Math.random() > 0.8 ? "ERROR" : "SUCCESS",
        message: `Executed ${agent.type} task successfully.`,
        details: {
            simulated: true,
            executionTimeMs: Math.floor(Math.random() * 1000),
        }
    };

    // Append log
    // Prisma doesn't have a simple 'push' for JSON arrays in all adapters, but we can read-append-write or use raw
    // For simplicity here, we'll do read-update
    // NOTE: In production with high concurrency, this needs better handling (e.g. separate Log table)

    const currentLogs = (agent.logs as unknown as any[]) || [];
    const newLogs = [logEntry, ...currentLogs].slice(0, 50); // Keep last 50

    return await prisma.agent.update({
        where: { id },
        data: {
            logs: newLogs,
        },
    });
};
