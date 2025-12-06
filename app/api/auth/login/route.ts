import { login } from '@/controllers/auth.controller';

export async function POST(request: Request) {
    return login(request);
}
