import { AgentForm } from "@/components/agents/agent-form";

export default function CreateAgentPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Create Agent</h2>
            </div>
            <AgentForm />
        </div>
    );
}
