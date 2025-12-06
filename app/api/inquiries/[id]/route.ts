import { getInquiry, updateInquiry as updateController, deleteInquiry as deleteController } from '@/controllers/inquiry.controller';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    return getInquiry(request, props);
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    return updateController(request, props);
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    return deleteController(request, props);
}
