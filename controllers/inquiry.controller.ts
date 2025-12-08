import { NextResponse } from 'next/server';
import * as inquiryService from '@/services/inquiry.service';
import { createInquirySchema, updateInquirySchema } from '@/helpers/validateInquiry';
import { getSession } from '@/lib/session';
import { InquiryStatus } from '@/constants/inquiries';
import { captureAction } from '@/helpers/captureAction';
import { ACTION_TYPES } from '@/constants/actionTypes';

export const listInquiries = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') as InquiryStatus | undefined;
        const productId = searchParams.get('productId') || undefined;

        const result = await inquiryService.getInquiries(page, limit, search, status, productId);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const getInquiry = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const inquiry = await inquiryService.getInquiryById(id);
        if (!inquiry) {
            return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
        }
        return NextResponse.json(inquiry);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const createInquiry = async (request: Request) => {
    try {
        const body = await request.json();
        const validatedData = createInquirySchema.parse(body);

        const { productId, ...rest } = validatedData;

        const match = await inquiryService.createInquiry({
            ...rest,
            product: { connect: { id: productId } }
        });

        // Inquiries are usually created by public users (unauthenticated), so userId might be null.
        // Or could be manual creation by admin.
        const session = await getSession();
        await captureAction(
            session?.id, // nullable
            ACTION_TYPES.INQUIRY_CREATE,
            "INQUIRY",
            match.id,
            { name: match.name, email: match.email },
            request.headers.get("x-forwarded-for") || undefined
        );

        return NextResponse.json(match, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};

export const updateInquiry = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const body = await request.json();
        const validatedData = updateInquirySchema.parse(body);

        // Get current user for note attribution
        const session = await getSession();
        const user = session?.name || session?.email || 'Admin';

        const inquiry = await inquiryService.updateInquiry(id, {
            ...validatedData,
            user
        });

        let action = "INQUIRY_UPDATE";
        if (validatedData.status) action = ACTION_TYPES.INQUIRY_STATUS_UPDATE;
        if (validatedData.assignedToId) action = ACTION_TYPES.INQUIRY_ASSIGN;

        await captureAction(
            session?.id,
            action,
            "INQUIRY",
            inquiry.id,
            { changes: validatedData },
            request.headers.get("x-forwarded-for") || undefined
        );

        return NextResponse.json(inquiry);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};

export const deleteInquiry = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        await inquiryService.deleteInquiry(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
