import prisma from "@/lib/prisma";

interface GetLogsParams {
    page?: number;
    pageSize?: number;
    action?: string;
    userId?: string;
    entity?: string;
    from?: string;
    to?: string;
}

export class AuditLogService {
    static async getLogs({ page = 1, pageSize = 20, action, userId, entity, from, to }: GetLogsParams) {
        const where: any = {};

        if (action && action !== "ALL") where.action = action;
        if (userId) where.userId = userId;
        if (entity && entity !== "ALL") where.entity = entity;

        if (from || to) {
            where.createdAt = {};
            if (from) where.createdAt.gte = new Date(from);
            if (to) where.createdAt.lte = new Date(to);
        }

        const skip = (page - 1) * pageSize;

        const [logs, total] = await prisma.$transaction([
            prisma.auditLog.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: { name: true, email: true },
                    },
                },
            }),
            prisma.auditLog.count({ where }),
        ]);

        return {
            logs,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }
}
