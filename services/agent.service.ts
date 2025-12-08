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

export const runAgent = async (id: string, runConfig?: any) => {
    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new Error("Agent not found");

    if (!agent.enabled) {
        throw new Error("Agent is disabled");
    }

    // Merge stored config with runtime overrides
    const finalConfig = { ...(agent.config as object), ...runConfig };

    // SIMULATION: Perform action based on type (Mocking OpenAI)
    let executionResult: any = { message: "Task completed" };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    switch (agent.type) {
        case AgentType.LEAD_GEN:
            executionResult = {
                message: `Generated 5 leads for area: ${finalConfig.area || 'General'}`,
                leads: ["Tech Corp", "StartUp Inc", "Enterprise Ltd"].map(n => ({ name: n, score: Math.floor(Math.random() * 100) }))
            };
            break;
        case AgentType.SEO:
            executionResult = {
                message: `Optimized content for keywords: ${finalConfig.keywords?.join(', ') || 'default'}`,
                seoScore: 95
            };
            break;
        case AgentType.LINKEDIN:
            executionResult = {
                message: `Sent connection requests to ${finalConfig.targetAudience || 'CEOs'}`,
                sentCount: 12
            };
            break;
        case AgentType.EMAIL_RESPONDER:
            executionResult = {
                message: `Responded to ${finalConfig.inquiryIds?.length || 0} inquiries`,
                status: "success"
            };
            break;
        default:
            executionResult = {
                message: `Executed ${agent.type} task successfully with config.`,
                configUsed: finalConfig
            };
    }

    const logEntry = {
        timestamp: new Date().toISOString(),
        status: "SUCCESS", // We assume success for simulation
        message: executionResult.message,
        details: {
            simulated: true,
            executionTimeMs: 1500,
            result: executionResult
        }
    };

    const currentLogs = (agent.logs as unknown as any[]) || [];
    const newLogs = [logEntry, ...currentLogs].slice(0, 50);

    return await prisma.agent.update({
        where: { id },
        data: {
            logs: newLogs,
        },
    });
};
