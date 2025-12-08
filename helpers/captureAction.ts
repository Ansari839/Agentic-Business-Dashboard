import prisma from "@/lib/prisma";

export async function captureAction(
    userId: string | undefined | null,
    action: string,
    entity: string,
    entityId: string | undefined | null,
    details?: any,
    ip?: string
) {
    try {
        await prisma.auditLog.create({
            data: {
                userId: userId || null,
                action,
                entity,
                entityId: entityId || null,
                details: details || {},
                ip: ip || null,
            },
        });
    } catch (error) {
        console.error("Failed to capture audit log:", error);
        // Do not throw error to avoid blocking the main action
    }
}
