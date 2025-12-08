"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AgentType } from "@/constants/agentTypes";

interface AgentConfigModalProps {
    agent: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (config: any) => Promise<void>;
}

export function AgentConfigModal({ agent, open, onOpenChange, onSubmit }: AgentConfigModalProps) {
    const [config, setConfig] = useState<any>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (agent) {
            // Initialize config with agent's default config OR empty
            setConfig({ ...(typeof agent.config === 'object' ? agent.config : {}) });
        }
    }, [agent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(config);
            onOpenChange(false);
        } catch (error) {
            console.error("Run error", error);
        } finally {
            setLoading(false);
        }
    };

    const renderFields = () => {
        if (!agent) return null;

        switch (agent.type) {
            case AgentType.LEAD_GEN:
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Target Area</Label>
                            <Input
                                value={config.area || ''}
                                onChange={e => setConfig({ ...config, area: e.target.value })}
                                placeholder="e.g. San Francisco, Remote"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Keywords (comma separated)</Label>
                            <Input
                                value={config.keywords?.join(', ') || ''}
                                onChange={e => setConfig({ ...config, keywords: e.target.value.split(',').map((s: string) => s.trim()) })}
                                placeholder="e.g. software, marketing"
                            />
                        </div>
                    </>
                );
            case AgentType.SEO:
                return (
                    <div className="space-y-2">
                        <Label>Target Keywords</Label>
                        <Input
                            value={config.keywords?.join(', ') || ''}
                            onChange={e => setConfig({ ...config, keywords: e.target.value.split(',').map((s: string) => s.trim()) })}
                            placeholder="e.g. best products, buy online"
                        />
                    </div>
                );
            case AgentType.LINKEDIN:
                return (
                    <>
                        <div className="space-y-2">
                            <Label>Target Audience</Label>
                            <Input
                                value={config.targetAudience || ''}
                                onChange={e => setConfig({ ...config, targetAudience: e.target.value })}
                                placeholder="e.g. CTOs, Founders"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Message Template</Label>
                            <Textarea
                                value={config.connectionRequestMessage || ''}
                                onChange={e => setConfig({ ...config, connectionRequestMessage: e.target.value })}
                                placeholder="Hi {name}, ..."
                            />
                        </div>
                    </>
                );
            // Add more cases for other agent types
            default:
                return (
                    <div className="space-y-2">
                        <Label>Additional Configuration</Label>
                        <Textarea
                            value={JSON.stringify(config, null, 2)}
                            readOnly
                            className="bg-muted text-muted-foreground font-mono text-xs"
                        />
                        <p className="text-xs text-muted-foreground">Generic runner for this agent type.</p>
                    </div>
                );
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Run {agent?.name}</DialogTitle>
                        <DialogDescription>
                            Configure runtime parameters for this {agent?.type} agent.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {renderFields()}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Running..." : "Run Agent"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
