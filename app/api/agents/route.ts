import { NextRequest } from "next/server";
import { listAgents, createAgent } from "@/controllers/agent.controller";

export async function GET() {
    return listAgents();
}

export async function POST(req: NextRequest) {
    return createAgent(req);
}
