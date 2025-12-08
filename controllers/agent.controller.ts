import { NextRequest, NextResponse } from "next/server";
import * as AgentService from "@/services/agent.service";
import { createAgentSchema, updateAgentSchema } from "@/helpers/validateAgent";
import { captureAction } from '@/helpers/captureAction';
import { ACTION_TYPES } from '@/constants/actionTypes';
import { getSession } from '@/lib/session';

export const listAgents = async () => {
    try {
        const agents = await AgentService.getAgents();
        return NextResponse.json({ success: true, data: agents });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch agents" }, { status: 500 });
    }
};

export const getAgent = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const agent = await AgentService.getAgentById(id);
        if (!agent) {
            return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: agent });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch agent" }, { status: 500 });
    }
};

export const createAgent = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const validation = createAgentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.errors }, { status: 400 });
        }

        const agent = await AgentService.createAgent(validation.data);

        const session = await getSession();
        await captureAction(
            session?.id,
            ACTION_TYPES.AGENT_CREATE,
            "AGENT",
            agent.id,
            { name: agent.name, type: agent.type },
        );

        return NextResponse.json({ success: true, data: agent }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to create agent" }, { status: 500 });
    }
};

export const updateAgent = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const body = await req.json();
        const validation = updateAgentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.errors }, { status: 400 });
        }

        const agent = await AgentService.updateAgent(id, validation.data);

        const session = await getSession();
        await captureAction(
            session?.id,
            ACTION_TYPES.AGENT_CONFIG_UPDATE,
            "AGENT",
            agent.id,
            { changes: validation.data },
        );

        return NextResponse.json({ success: true, data: agent });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update agent" }, { status: 500 });
    }
};

export const deleteAgent = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        await AgentService.deleteAgent(id);

        const session = await getSession();
        await captureAction(
            session?.id,
            "AGENT_DELETE",
            "AGENT",
            id,
            null,
        );

        return NextResponse.json({ success: true, message: "Agent deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete agent" }, { status: 500 });
    }
};

export const runAgent = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;

        let runConfig = {};
        try {
            const body = await req.json();
            runConfig = body.config || {};
        } catch (e) {
            // Ignore JSON parse error if body is empty
        }

        const agent = await AgentService.runAgent(id, runConfig);
        // Return the latest log entry
        const latestLog = (agent.logs as any[])[0];

        const session = await getSession();
        await captureAction(
            session?.id,
            ACTION_TYPES.AGENT_RUN,
            "AGENT",
            id,
            { result: latestLog },
        );

        return NextResponse.json({ success: true, data: { agent, result: latestLog } });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || "Failed to run agent" }, { status: 500 });
    }
};
