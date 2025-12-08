import prisma from "@/lib/prisma";
import { InquiryStatus, AgentType } from "@/app/generated/prisma/client";

interface EmailResponderConfig {
    tone: 'Friendly' | 'Professional' | 'Formal';
    autoSend: boolean;
    cc?: string;
    instructions?: string;
    inquiryIds: string[];
}

export class EmailResponderService {

    // Ensure the agent exists in DB
    private async getAgent() {
        let agent = await prisma.agent.findFirst({
            where: { type: AgentType.EMAIL_RESPONDER }
        });

        if (!agent) {
            agent = await prisma.agent.create({
                data: {
                    name: "Email Responder",
                    type: AgentType.EMAIL_RESPONDER,
                    config: {},
                    logs: []
                }
            });
        }
        return agent;
    }

    async getConfig() {
        const agent = await this.getAgent();
        return agent.config;
    }

    async updateConfig(config: any) {
        const agent = await this.getAgent();
        return await prisma.agent.update({
            where: { id: agent.id },
            data: { config }
        });
    }

    async clearConfig() {
        const agent = await this.getAgent();
        return await prisma.agent.update({
            where: { id: agent.id },
            data: { config: {} }
        });
    }

    async run(runtimeConfig: EmailResponderConfig) {
        const agent = await this.getAgent();
        if (!agent.enabled) throw new Error("Agent is disabled");

        const { inquiryIds, tone, autoSend, cc, instructions } = runtimeConfig;
        const results = [];

        for (const inquiryId of inquiryIds) {
            try {
                const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
                if (!inquiry) {
                    results.push({ inquiryId, status: "FAILED", error: "Inquiry not found" });
                    continue;
                }

                // SIMULATION of OpenAI Draft Generation
                const draft = `Subject: Re: Inquiry regarding ${inquiry.productId}\n\n` +
                    `Dear ${inquiry.name},\n\n` +
                    `[${tone.toUpperCase()} TONE]\n` +
                    `${instructions ? `Context: ${instructions}\n` : ''}` +
                    `Thank you for your message: "${inquiry.message}". \n` +
                    `We will get back to you shortly.\n\n` +
                    `Best regards,\nSupport Team` +
                    `${cc ? `\nCC: ${cc}` : ''}`;

                // Simulate processing delay
                await new Promise(r => setTimeout(r, 600));

                if (autoSend) {
                    // Update status if auto-send
                    await prisma.inquiry.update({
                        where: { id: inquiryId },
                        data: { status: InquiryStatus.CONTACTED }
                    });
                }

                results.push({
                    inquiryId,
                    status: autoSend ? "SENT" : "DRAFTED",
                    response: draft
                });

            } catch (error: any) {
                results.push({ inquiryId, status: "ERROR", error: error.message });
            }
        }

        // Log execution
        const logEntry = {
            timestamp: new Date().toISOString(),
            status: "SUCCESS",
            summary: `Processed ${results.length} inquiries`,
            details: results
        };

        const currentLogs = (agent.logs as unknown as any[]) || [];
        await prisma.agent.update({
            where: { id: agent.id },
            data: { logs: [logEntry, ...currentLogs].slice(0, 50) }
        });

        return { results };
    }
}

export const emailResponderService = new EmailResponderService();
