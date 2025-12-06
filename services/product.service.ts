import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const getProducts = async (page = 1, limit = 10, search = '') => {
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = search
        ? {
            title: {
                contains: search,
                mode: 'insensitive',
            },
        }
        : {};

    const [data, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
    ]);

    return { data, total, page, limit };
};

export const getProductById = async (id: string) => {
    return await prisma.product.findUnique({
        where: { id },
    });
};

export const getProductBySlug = async (slug: string) => {
    return await prisma.product.findUnique({
        where: { slug },
    });
};

export const createProduct = async (data: Prisma.ProductCreateInput) => {
    // Ensure slug is unique
    const existing = await getProductBySlug(data.slug);
    if (existing) {
        throw new Error(`Product with slug "${data.slug}" already exists`);
    }
    return await prisma.product.create({
        data,
    });
};

export const updateProduct = async (id: string, data: Prisma.ProductUpdateInput) => {
    // If updating slug, check uniqueness
    if (data.slug && typeof data.slug === 'string') {
        const existing = await getProductBySlug(data.slug);
        if (existing && existing.id !== id) {
            throw new Error(`Product with slug "${data.slug}" already exists`);
        }
    }

    return await prisma.product.update({
        where: { id },
        data,
    });
};

export const deleteProduct = async (id: string) => {
    return await prisma.product.delete({
        where: { id },
    });
};
