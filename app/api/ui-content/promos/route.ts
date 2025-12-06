import { updatePromos } from '@/controllers/uiContent.controller';

export async function PATCH(request: Request) {
    return updatePromos(request);
}
