"use client";

import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface AgentTemplate {
    id: string;
    name: string;
    type: string;
    baseURL: string;
    description: string;
}

interface AgentTemplateSelectorProps {
    onSelect?: (template: AgentTemplate) => void;
}

export default function AgentTemplateSelector({ onSelect }: AgentTemplateSelectorProps) {
    const [templates, setTemplates] = useState<AgentTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await fetch("/api/agents/templates");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setTemplates(data);
                }
            } catch (error) {
                console.error("Failed to fetch templates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const handleSelect = (value: string) => {
        const template = templates.find(t => t.id === value);
        if (template) {
            setSelectedTemplate(template);
            if (onSelect) onSelect(template);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Select Agent Persona</Label>
                <Select onValueChange={handleSelect} disabled={loading}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={loading ? "Loading templates..." : "Choose an agent template"} />
                    </SelectTrigger>
                    <SelectContent>
                        {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                                {template.name} ({template.type})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedTemplate && (
                <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{selectedTemplate.name}</CardTitle>
                            <Badge variant="outline">{selectedTemplate.type}</Badge>
                        </div>
                        <CardDescription>{selectedTemplate.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-muted-foreground font-mono bg-slate-200 dark:bg-slate-800 p-2 rounded">
                            Base URL: {selectedTemplate.baseURL}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
