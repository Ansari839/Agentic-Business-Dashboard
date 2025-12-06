import prisma from '@/lib/prisma';
import { Role } from '@/constants/roles';

export const getUsersByRole = async (roles: Role[]) => {
    return await prisma.user.findMany({
        where: {
            role: {
                in: roles,
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
};
