import { getUiContent } from "@/services/uiContent.service";
import { PromosForm } from "@/components/ui-content/promos-form";

export default async function PromosEditorPage() {
    const content = await getUiContent();
    const promos = content?.promos as any;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Edit Promos</h2>
            <PromosForm initialData={promos} />
        </div>
    );
}
