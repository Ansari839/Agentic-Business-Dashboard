import { getProduct, updateProduct as updateController, deleteProduct as deleteController } from '@/controllers/product.controller';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    return getProduct(request, props);
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    return updateController(request, props);
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    return deleteController(request, props);
}
