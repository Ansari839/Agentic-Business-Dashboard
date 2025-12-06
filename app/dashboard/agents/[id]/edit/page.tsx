import { AgentForm } from "@/components/agents/agent-form";
import { getAgentById } from "@/services/agent.service";
import { notFound } from "next/navigation";

export default async function EditAgentPage({ params }: { params: { id: string } }) {
    const agent = await getAgentById(params.id);

    if (!agent) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Edit Agent</h2>
            </div>
            <AgentForm initialData={agent} />
        </div>
    );
}
