import { getUiContent } from "@/services/uiContent.service";
import { FooterForm } from "@/components/ui-content/footer-form";

export default async function FooterEditorPage() {
    const content = await getUiContent();
    const footer = content?.footer as any;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Edit Footer</h2>
            <FooterForm initialData={footer} />
        </div>
    );
}
