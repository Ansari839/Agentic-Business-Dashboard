import { listProducts, createProduct as createController } from '@/controllers/product.controller';

export async function GET(request: Request) {
    return listProducts(request);
}

export async function POST(request: Request) {
    return createController(request);
}
