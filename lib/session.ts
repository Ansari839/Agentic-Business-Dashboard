import { cookies } from 'next/headers';
import { verifyJWT } from '@/helpers/jwt';

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return await verifyJWT(token);
}
