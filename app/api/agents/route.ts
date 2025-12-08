export const dynamic = 'force-dynamic';
import { listAgents, createAgent } from "@/controllers/agent.controller";

export const GET = listAgents;
export const POST = createAgent;
