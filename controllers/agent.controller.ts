import { NextRequest, NextResponse } from "next/server";
import * as AgentService from "@/services/agent.service";
import { getSession } from '@/lib/session';
import { ACTION_TYPES } from '@/constants/actionTypes';
import { captureAction } from '@/helpers/captureAction';

export const listAgents = async () => {
    try {
        const agents = await AgentService.getAgents();
        return NextResponse.json({ success: true, data: agents });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch agents" }, { status: 500 });
    }
};

export const createAgent = async (req: NextRequest) => {
    try {
        const body = await req.json();
        // Basic validation
        if (!body.name || !body.type) {
            return NextResponse.json({ success: false, error: "Name and Type are required" }, { status: 400 });
        }

        const agent = await AgentService.createAgent(body);
        return NextResponse.json({ success: true, data: agent }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to create agent" }, { status: 500 });
    }
};

export const deleteAgent = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        await AgentService.deleteAgent(id);
        return NextResponse.json({ success: true, message: "Agent deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete agent" }, { status: 500 });
    }
};

export const runEmailResponder = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { agentId, inquiryIds, emailAPIKey } = body;

        if (!agentId || !inquiryIds || !Array.isArray(inquiryIds)) {
            return NextResponse.json({ success: false, error: "Invalid parameters" }, { status: 400 });
        }

        const result = await AgentService.runEmailResponder(agentId, { inquiryIds, emailAPIKey });

        // Log action
        const session = await getSession();
        await captureAction(
            session?.id,
            ACTION_TYPES.AGENT_RUN,
            "AGENT",
            agentId,
            { type: 'EMAIL_RESPONDER', count: inquiryIds.length }
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};
