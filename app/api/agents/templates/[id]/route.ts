import { NextResponse } from 'next/server';
import { AgentTemplateController } from '@/controllers/agentTemplate.controller';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return AgentTemplateController.getTemplate(request, { params: { id } });
}
