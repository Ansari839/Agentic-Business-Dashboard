"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Play, Plus } from "lucide-react";
import { formatLogDate } from "@/helpers/formatLogs";
import { EmailResponderConfigModal } from "@/components/agents/EmailResponderConfigModal";
import { useToast } from "@/components/ui/use-toast";

interface Agent {
    id: string;
    name: string;
    type: string;
    enabled: boolean;
    logs: any[];
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { toast } = useToast();

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/agents");
            const data = await res.json();
            if (data.success) {
                setAgents(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch agents", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleRunClick = (agent: Agent) => {
        if (agent.type === "EMAIL_RESPONDER") {
            setSelectedAgent(agent);
            setModalOpen(true);
        } else {
            toast({
                title: "Agent Run",
                description: `Manual run not implemented for ${agent.type} yet.`,
            });
        }
    };

    const handleConfigSubmit = async (config: any) => {
        if (!selectedAgent) return;

        try {
            const endpoint = selectedAgent.type === "EMAIL_RESPONDER"
                ? "/api/agents/email-responder/run"
                : `/api/agents/${selectedAgent.id}/run`;

            const payload = selectedAgent.type === "EMAIL_RESPONDER"
                ? { agentId: selectedAgent.id, ...config }
                : { config };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                toast({
                    title: "Agent Executed",
                    description: selectedAgent.type === "EMAIL_RESPONDER"
                        ? `Processed ${data.data.details?.sentEmails?.length || 0} emails.`
                        : "Agent run successfully."
                });
                fetchAgents(); // Refresh logs
            } else {
                toast({
                    title: "Execution Failed",
                    description: data.error,
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to run agent.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Automation Agents</h2>
                <Button disabled>
                    <Plus className="mr-2 h-4 w-4" />
                    New Agent
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Installed Agents</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Last Run</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">Loading agents...</TableCell>
                                </TableRow>
                            ) : agents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No agents installed.</TableCell>
                                </TableRow>
                            ) : (
                                agents.map((agent) => {
                                    const lastLog = agent.logs?.[0];
                                    return (
                                        <TableRow key={agent.id}>
                                            <TableCell className="font-medium">
                                                {agent.name}
                                                {!agent.enabled && <Badge variant="outline" className="ml-2">Disabled</Badge>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {agent.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {lastLog ? (
                                                    <div className="flex flex-col text-xs">
                                                        <span>{formatLogDate(lastLog.timestamp)}</span>
                                                        <span className={lastLog.status === 'ERROR' ? 'text-red-500' : 'text-green-500'}>
                                                            {lastLog.status}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">Never</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleRunClick(agent)}
                                                    disabled={!agent.enabled}
                                                >
                                                    <Play className="mr-2 h-4 w-4" />
                                                    Run
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <EmailResponderConfigModal
                agent={selectedAgent}
                open={modalOpen}
                onOpenChange={setModalOpen}
                onSubmit={handleConfigSubmit}
            />
        </div>
    );
}
