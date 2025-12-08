import { NextResponse } from 'next/server';
import * as uiService from '@/services/uiContent.service';
import { headerSchema, slidersSchema, footerSchema, promoSchema } from '@/helpers/sliderSchema';
import { captureAction } from '@/helpers/captureAction';
import { ACTION_TYPES } from '@/constants/actionTypes';
import { getSession } from '@/lib/session';

export const getUiContent = async (request: Request) => {
    try {
        const content = await uiService.getUiContent();

        // Parse header if it's stored as string
        const parsedContent = {
            ...content,
            header: typeof content?.header === 'string' ? JSON.parse(content.header) : content?.header,
        };

        return NextResponse.json(parsedContent);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const updateHeader = async (request: Request) => {
    try {
        const body = await request.json();
        const validated = headerSchema.parse(body);
        const content = await uiService.updateUiContent({ header: validated });

        const session = await getSession();
        await captureAction(
            session?.id,
            ACTION_TYPES.UI_HEADER_UPDATE,
            "UI_CONTENT",
            content.id,
            { changes: validated }
        );

        return NextResponse.json(content);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};

export const updateSliders = async (request: Request) => {
    try {
        const body = await request.json();
        const validated = slidersSchema.parse(body);
        const content = await uiService.updateUiContent({ sliders: validated });

        const session = await getSession();
        await captureAction(
            session?.id,
            ACTION_TYPES.UI_SLIDER_UPDATE,
            "UI_CONTENT",
            content.id,
            { changes: validated }
        );

        return NextResponse.json(content);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};

export const updateFooter = async (request: Request) => {
    try {
        const body = await request.json();
        const validated = footerSchema.parse(body);
        const content = await uiService.updateUiContent({ footer: validated });

        const session = await getSession();
        await captureAction(
            session?.id,
            ACTION_TYPES.UI_FOOTER_UPDATE,
            "UI_CONTENT",
            content.id,
            { changes: validated }
        );

        return NextResponse.json(content);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};

export const updatePromos = async (request: Request) => {
    try {
        const body = await request.json();
        const validated = promoSchema.parse(body);
        const content = await uiService.updateUiContent({ promos: validated });

        const session = await getSession();
        await captureAction(
            session?.id,
            ACTION_TYPES.UI_PROMO_UPDATE,
            "UI_CONTENT",
            content.id,
            { changes: validated }
        );

        return NextResponse.json(content);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
};
