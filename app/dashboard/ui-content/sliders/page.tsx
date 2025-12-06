import { getUiContent } from "@/services/uiContent.service";
import { SlidersForm } from "@/components/ui-content/sliders-form";

export default async function SlidersEditorPage() {
    const content = await getUiContent();
    // content.sliders is Json type, auto-parsed by PrismaClient default behavior often, but let's be safe.
    // In `uiContent.service.ts`, we passed `DEFAULT_SLIDERS` which is array.

    const sliders = content?.sliders ? (content.sliders as any) : [];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Edit Sliders</h2>
            <SlidersForm initialData={sliders} />
        </div>
    );
}
