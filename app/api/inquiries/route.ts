import { listInquiries, createInquiry as createController } from '@/controllers/inquiry.controller';

export async function GET(request: Request) {
    return listInquiries(request);
}

export async function POST(request: Request) {
    return createController(request);
}
