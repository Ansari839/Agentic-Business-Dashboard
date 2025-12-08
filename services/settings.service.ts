import prisma from "@/lib/prisma";

export class SettingsService {
    static async getEmployees() {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                apiLimits: true,
                apiUsage: true,
                featureFlags: true,
            },
            orderBy: { name: 'asc' }
        });
    }

    static async getEmployeeById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                apiLimits: true,
                apiUsage: true,
                featureFlags: true,
            },
        });
    }

    static async updateEmployee(id: string, data: any) {
        return prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                apiLimits: true,
                apiUsage: true,
                featureFlags: true,
            },
        });
    }

    static async getFeatures() {
        return prisma.featureToggle.findMany({
            orderBy: { key: 'asc' }
        });
    }

    static async updateFeature(key: string, isEnabled: boolean) {
        return prisma.featureToggle.upsert({
            where: { key },
            update: { isEnabled },
            create: {
                key,
                label: key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                isEnabled
            }
        });
    }
}
