import prisma from "@/lib/prisma";
import { AgentType, InquiryStatus } from "@/app/generated/prisma/client";

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

export const deleteAgent = async (id: string) => {
    return await prisma.agent.delete({
        where: { id },
    });
};

interface EmailResponderConfig {
    inquiryIds: string[];
    emailAPIKey?: string;
}

export const runEmailResponder = async (agentId: string, config: EmailResponderConfig) => {
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new Error("Agent not found");
    if (!agent.enabled) throw new Error("Agent is disabled");

    const sentEmails = [];

    // Process each inquiry
    for (const inquiryId of config.inquiryIds) {
        try {
            const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
            if (!inquiry) {
                sentEmails.push({ inquiryId, status: "FAILED", error: "Inquiry not found" });
                continue;
            }

            // SIMULATION: Send email
            // In a real app, use OpenAI to generate response based on inquiry.message
            // and use a mailer service to send.

            const responseText = `Dear ${inquiry.name},\n\nThank you for your interest in ${inquiry.productId}. We have received your message: "${inquiry.message}".\n\nA representative will contact you shortly.\n\nBest,\nAutomated Agent`;

            // Simulate delay
            await new Promise(r => setTimeout(r, 500));

            // Update inquiry status
            await prisma.inquiry.update({
                where: { id: inquiryId },
                data: { status: InquiryStatus.CONTACTED }
            });

            sentEmails.push({
                inquiryId,
                status: "SENT",
                responseText,
                recipient: inquiry.email
            });

        } catch (error: any) {
            sentEmails.push({ inquiryId, status: "FAILED", error: error.message });
        }
    }

    const logEntry = {
        timestamp: new Date().toISOString(),
        status: "SUCCESS",
        message: `Processed ${sentEmails.length} inquiries`,
        details: { sentEmails }
    };

    const currentLogs = (agent.logs as unknown as any[]) || [];
    const newLogs = [logEntry, ...currentLogs].slice(0, 50);

    return await prisma.agent.update({
        where: { id: agentId },
        data: { logs: newLogs }
    });
};
