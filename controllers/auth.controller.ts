import { NextResponse } from 'next/server';
import * as authService from '@/services/auth.service';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const login = async (request: Request) => {
    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        const token = await authService.login(email, password);

        const response = NextResponse.json({ success: true });

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;

    } catch (error: any) {
        console.error('Login error:', error);
        // Determine status code based on error type if needed
        const status = error.message === 'Invalid credentials' ? 401 : 500;
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status }
        );
    }
};
