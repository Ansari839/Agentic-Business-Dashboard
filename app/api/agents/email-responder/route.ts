export const dynamic = 'force-dynamic';
import { getConfig, updateConfig, deleteConfig } from "@/controllers/agents/emailResponder.controller";

export const GET = getConfig;
export const PUT = updateConfig;
export const DELETE = deleteConfig;
