import { NextResponse } from 'next/server';
import { AgentTemplateController } from '@/controllers/agentTemplate.controller';

export async function GET() {
    return AgentTemplateController.listTemplates();
}
