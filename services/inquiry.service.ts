import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { InquiryStatus } from '@/constants/inquiries';

export const getInquiries = async (
    page = 1,
    limit = 10,
    search = '',
    status?: InquiryStatus,
    productId?: string
) => {
    const skip = (page - 1) * limit;
    const where: Prisma.InquiryWhereInput = {
        AND: [
            search ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            } : {},
            status ? { status } : {},
            productId ? { productId } : {},
        ],
    };

    const [data, total] = await Promise.all([
        prisma.inquiry.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                product: { select: { title: true } },
                assignedTo: { select: { name: true, email: true } },
            },
        }),
        prisma.inquiry.count({ where }),
    ]);

    return { data, total, page, limit };
};

export const getInquiryById = async (id: string) => {
    return await prisma.inquiry.findUnique({
        where: { id },
        include: {
            product: true,
            assignedTo: { select: { id: true, name: true, email: true } },
        },
    });
};

export const createInquiry = async (data: Prisma.InquiryCreateInput) => {
    return await prisma.inquiry.create({
        data,
    });
};

export const updateInquiry = async (
    id: string,
    data: {
        status?: InquiryStatus;
        assignedToId?: string | null;
        note?: string;
        user?: string; // Author of the note
    }
) => {
    const updateData: Prisma.InquiryUpdateInput = {};

    if (data.status) updateData.status = data.status;
    if (data.assignedToId !== undefined) {
        updateData.assignedTo = data.assignedToId ? { connect: { id: data.assignedToId } } : { disconnect: true };
    }

    if (data.note) {
        // Append note to existing notes
        // Needs to fetch existing notes first or use atomic push if JSON supported comfortably, but standard prisma pattern with JSON checks:
        const current = await prisma.inquiry.findUnique({ where: { id }, select: { notes: true } });
        const currentNotes = (current?.notes as any[]) || [];
        const newNote = {
            text: data.note,
            author: data.user || 'System',
            date: new Date().toISOString(),
        };
        updateData.notes = [...currentNotes, newNote];
    }

    return await prisma.inquiry.update({
        where: { id },
        data: updateData,
        include: {
            product: true,
            assignedTo: { select: { id: true, name: true, email: true } },
        }
    });
};

export const deleteInquiry = async (id: string) => {
    return await prisma.inquiry.delete({
        where: { id },
    });
};
