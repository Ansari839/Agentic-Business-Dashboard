import { NextRequest } from "next/server";
import { runAgent } from "@/controllers/agent.controller";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    return runAgent(req, { params });
}
