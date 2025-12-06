import prisma from '@/lib/prisma';
import { DEFAULT_HEADER, DEFAULT_SLIDERS, DEFAULT_FOOTER, DEFAULT_PROMOS } from '@/constants/uiDefaults';

export const getUiContent = async () => {
    // Find the first record, if not exists, create with defaults
    // Since we only have one "site configuration", we can just take the first one or a specific ID if we had multi-tenancy.
    // Assuming single tenant:
    let content = await prisma.uiContent.findFirst();

    if (!content) {
        content = await prisma.uiContent.create({
            data: {
                header: JSON.stringify(DEFAULT_HEADER),
                sliders: DEFAULT_SLIDERS as any, // Prisma Json type
                footer: DEFAULT_FOOTER as any,
                promos: DEFAULT_PROMOS as any,
            }
        });
    }

    return content;
};

export const updateUiContent = async (
    data: {
        header?: any;
        sliders?: any;
        footer?: any;
        promos?: any;
    }
) => {
    // We assume there is always one record thanks to getUiContent logic, but to be safe:
    const existing = await prisma.uiContent.findFirst();
    const id = existing?.id;

    if (!id) {
        // If it somehow doesn't exist, create it with the updates + defaults for others
        return await prisma.uiContent.create({
            data: {
                header: data.header ? JSON.stringify(data.header) : JSON.stringify(DEFAULT_HEADER),
                sliders: (data.sliders || DEFAULT_SLIDERS) as any,
                footer: (data.footer || DEFAULT_FOOTER) as any,
                promos: (data.promos || DEFAULT_PROMOS) as any,
            }
        });
    }

    // Update existing
    // Note: inputs for header are objects, but Prisma schema defines optional String for header?
    // User request: "header: String?" in schema snippet... wait. 
    // Schema says: line 92 `header String?`
    // Inputs (sliders) line 93 `sliders Json?`
    // Helper schema defines header as object.
    // So for `header`, we must stringify before saving if the schema really is String.
    // Sliders, footer, promos are Json in schema.

    // I should create/update carefully.

    return await prisma.uiContent.update({
        where: { id },
        data: {
            ...(data.header && { header: typeof data.header === 'string' ? data.header : JSON.stringify(data.header) }),
            ...(data.sliders && { sliders: data.sliders }),
            ...(data.footer && { footer: data.footer }),
            ...(data.promos && { promos: data.promos }),
        }
    });
};
