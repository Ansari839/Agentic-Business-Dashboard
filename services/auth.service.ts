import prisma from '@/lib/prisma';
import { comparePassword } from '@/helpers/bcrypt';
import { signJWT } from '@/helpers/jwt';

export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || !user.password) {
        throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
        throw new Error('Invalid credentials');
    }

    const token = await signJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    return token;
};
