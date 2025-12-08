
import { NextResponse } from 'next/server';
import { SettingsController } from '@/controllers/settings.controller';

export async function GET(request: Request) {
    return SettingsController.listFeatures();
}

export async function PUT(request: Request) {
    return SettingsController.updateFeature(request);
}
