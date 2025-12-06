import { getUiContent } from '@/controllers/uiContent.controller';

export async function GET(request: Request) {
    return getUiContent(request);
}
