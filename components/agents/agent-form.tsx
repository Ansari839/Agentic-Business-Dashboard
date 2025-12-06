"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AgentType, AGENT_TYPE_LABELS, AGENT_DESCRIPTIONS } from "@/constants/agentTypes";

interface AgentFormProps {
    initialData?: {
        id?: string;
        name: string;
        type: AgentType;
        enabled: boolean;
        config: any;
    };
}

const DEFAULT_CONFIGS: Record<AgentType, any> = {
    [AgentType.LEAD_GEN]: {
        keywords: ["software", "tech"],
        platform: "Twitter",
        maxLeads: 50,
    },
    [AgentType.LINKEDIN]: {
        connectionMessage: "Hi {name}, I noticed we work in the same industry.",
        maxDailyInvites: 20,
    },
    [AgentType.EMAIL_RESPONDER]: {
        signature: "Best,\nAI Assistant",
        responseTimeDelayMinutes: 5,
    },
    [AgentType.CHAT_SUPPORT]: {
        model: "gpt-4",
        tone: "professional",
    },
    [AgentType.SEO]: {
        targetPages: ["/"],
        focusKeywords: ["best product"],
    },
    [AgentType.IMAGE_FIXER]: {
        optimizationLevel: "high",
        addAltText: true,
    },
};

export function AgentForm({ initialData }: AgentFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        type: initialData?.type || AgentType.LEAD_GEN,
        enabled: initialData?.enabled ?? true,
        config: JSON.stringify(initialData?.config || DEFAULT_CONFIGS[AgentType.LEAD_GEN], null, 2),
    });

    const [configError, setConfigError] = useState("");

    const handleTypeChange = (type: AgentType) => {
        setFormData((prev) => ({
            ...prev,
            type,
            config: JSON.stringify(DEFAULT_CONFIGS[type], null, 2),
        }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setConfigError("");
        setLoading(true);

        // Validate JSON
        let parsedConfig;
        try {
            parsedConfig = JSON.parse(formData.config);
        } catch (e) {
            setConfigError("Invalid JSON configuration.");
            setLoading(false);
            return;
        }

        const payload = {
            ...formData,
            config: parsedConfig,
        };

        try {
            const url = initialData?.id ? `/api/agents/${initialData.id}` : "/api/agents";
            const method = initialData?.id ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Something went wrong");
            }

            router.refresh();
            router.push("/dashboard/agents");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Agent Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            placeholder="e.g. Sales Outreach Bot"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Agent Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(val) => handleTypeChange(val as AgentType)}
                            disabled={!!initialData?.id} // Prevent type change on edit
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(AgentType).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {AGENT_TYPE_LABELS[type]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                            {AGENT_DESCRIPTIONS[formData.type]}
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="enabled"
                            checked={formData.enabled}
                            onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                        />
                        <Label htmlFor="enabled">Enable Agent</Label>
                    </div>

                    <div className="space-y-2">
                        <Label>Configuration (JSON)</Label>
                        <Textarea
                            value={formData.config}
                            onChange={(e) => setFormData({ ...formData, config: e.target.value })}
                            className="font-mono text-xs min-h-[200px]"
                            required
                        />
                        {configError && <p className="text-red-500 text-sm">{configError}</p>}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : initialData?.id ? "Update Agent" : "Create Agent"}
                </Button>
            </div>
        </form>
    );
}
