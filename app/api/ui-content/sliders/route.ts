import { updateSliders } from '@/controllers/uiContent.controller';

export async function PATCH(request: Request) {
    return updateSliders(request);
}
