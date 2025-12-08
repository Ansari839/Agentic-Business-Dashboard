
import { NextResponse } from 'next/server';
import { SettingsController } from '@/controllers/settings.controller';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return SettingsController.getEmployee(request, { params: { id } });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return SettingsController.updateEmployee(request, { params: { id } });
}
