import { NextResponse } from 'next/server';
import * as productService from '@/services/product.service';
import { productSchema } from '@/helpers/validateInput';
import { captureAction } from '@/helpers/captureAction';
import { ACTION_TYPES } from '@/constants/actionTypes';
import { getSession } from '@/lib/session';

export const listProducts = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const result = await productService.getProducts(page, limit, search);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const getProduct = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const product = await productService.getProductById(id);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const createProduct = async (request: Request) => {
    try {
        const body = await request.json();
        const validatedData = productSchema.parse(body);

        const product = await productService.createProduct(validatedData);

        const session = await getSession();
        await captureAction(
            session?.id,
            ACTION_TYPES.PRODUCT_CREATE,
            "PRODUCT",
            product.id,
            { title: product.title },
            request.headers.get("x-forwarded-for") || undefined
        );

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};

export const updateProduct = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const body = await request.json();
        // Partial validation could be done here, reusing schema for now
        // For partial updates we might want .partial() but sticking to full schema for edit form
        const validatedData = productSchema.parse(body);

        const product = await productService.updateProduct(id, validatedData);

        const session = await getSession();
        await captureAction(
            session?.id,
            ACTION_TYPES.PRODUCT_UPDATE,
            "PRODUCT",
            product.id,
            { changes: body }, // capturing full body as changes
            request.headers.get("x-forwarded-for") || undefined
        );

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};

export const deleteProduct = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        await productService.deleteProduct(id);

        const session = await getSession();
        await captureAction(
            session?.id,
            ACTION_TYPES.PRODUCT_DELETE,
            "PRODUCT",
            id,
            null,
            request.headers.get("x-forwarded-for") || undefined
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
