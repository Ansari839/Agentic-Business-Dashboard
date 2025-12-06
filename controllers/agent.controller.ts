import { NextRequest, NextResponse } from "next/server";
import * as AgentService from "@/services/agent.service";
import { createAgentSchema, updateAgentSchema } from "@/helpers/validateAgent";

export const listAgents = async () => {
    try {
        const agents = await AgentService.getAgents();
        return NextResponse.json({ success: true, data: agents });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to fetch agents" }, { status: 500 });
    }
};

export const getAgent = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const agent = await AgentService.getAgentById(params.id);
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
        return NextResponse.json({ success: true, data: agent }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to create agent" }, { status: 500 });
    }
};

export const updateAgent = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const body = await req.json();
        const validation = updateAgentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.errors }, { status: 400 });
        }

        const agent = await AgentService.updateAgent(params.id, validation.data);
        return NextResponse.json({ success: true, data: agent });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to update agent" }, { status: 500 });
    }
};

export const deleteAgent = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        await AgentService.deleteAgent(params.id);
        return NextResponse.json({ success: true, message: "Agent deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete agent" }, { status: 500 });
    }
};

export const runAgent = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const agent = await AgentService.runAgent(params.id);
        // Return the latest log entry
        const latestLog = (agent.logs as any[])[0];
        return NextResponse.json({ success: true, data: { agent, result: latestLog } });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || "Failed to run agent" }, { status: 500 });
    }
}
