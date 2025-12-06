import { updateHeader } from '@/controllers/uiContent.controller';

export async function PATCH(request: Request) {
    return updateHeader(request);
}
