"use client";

import { useState } from "react";
import { AgentForm } from "@/components/agents/agent-form";
import AgentTemplateSelector from "@/components/agents/AgentTemplateSelector";

export default function CreateAgentPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    const handleTemplateSelect = (template: any) => {
        // Merge baseURL into config for the agent instance
        const configWithUrl = {
            ...template.config,
            baseURL: template.baseURL,
        };

        setSelectedTemplate({
            name: template.name,
            type: template.type,
            enabled: true,
            config: configWithUrl,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Create Agent</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">1. Choose a Persona</h3>
                    <AgentTemplateSelector onSelect={handleTemplateSelect} />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">2. Configure & Deploy</h3>
                    <div className="bg-slate-50 dark:bg-slate-900 border rounded-lg p-4">
                        {selectedTemplate ? (
                            <AgentForm
                                key={selectedTemplate.name} // Force re-mount to reset form state
                                initialData={selectedTemplate}
                            />
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>Select a persona from the left to get started.</p>
                                <div className="border-t my-4" />
                                <p className="text-sm">Or you can create one from scratch (not implemented in this view).</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
