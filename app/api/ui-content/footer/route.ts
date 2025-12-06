import { updateFooter } from '@/controllers/uiContent.controller';

export async function PATCH(request: Request) {
    return updateFooter(request);
}
