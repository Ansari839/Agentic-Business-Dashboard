import { NextResponse } from 'next/server';
import * as productService from '@/services/product.service';
import { productSchema } from '@/helpers/validateInput';

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
        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};

export const deleteProduct = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        await productService.deleteProduct(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
