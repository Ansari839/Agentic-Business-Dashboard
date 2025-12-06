import { getUiContent } from "@/services/uiContent.service";
import { HeaderForm } from "@/components/ui-content/header-form";

export default async function HeaderEditorPage() {
    const content = await getUiContent();
    // Ensure header is parsed object if stored as string, though service might return it raw.
    // Model has `header String?`
    // Service getUiContent creates defaults.
    // Controller parsed it. Here in Server Component we must parse if string.

    let initialData = content?.header || {};
    if (typeof initialData === 'string') {
        try {
            initialData = JSON.parse(initialData);
        } catch (e) {
            initialData = {};
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Edit Header</h2>
            <HeaderForm initialData={initialData} />
        </div>
    );
}
