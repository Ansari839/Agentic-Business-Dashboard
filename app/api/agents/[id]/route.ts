import { NextRequest } from "next/server";
import { getAgent, updateAgent, deleteAgent } from "@/controllers/agent.controller";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    return getAgent(req, { params });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    return updateAgent(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return deleteAgent(req, { params });
}
