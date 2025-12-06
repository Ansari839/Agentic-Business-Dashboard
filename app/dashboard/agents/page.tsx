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
import { Switch } from "@/components/ui/switch";
import { Play, Edit, Trash, Plus, RotateCw, FileText } from "lucide-react";
import { AgentType, AGENT_TYPE_LABELS } from "@/constants/agentTypes";
import { formatLogDate } from "@/helpers/formatLogs";

interface Agent {
    id: string;
    name: string;
    type: AgentType;
    enabled: boolean;
    createdAt: string;
    logs: any[];
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [runningId, setRunningId] = useState<string | null>(null);

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

    const handleToggle = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setAgents(prev => prev.map(a => a.id === id ? { ...a, enabled: !currentStatus } : a));

        try {
            await fetch(`/api/agents/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled: !currentStatus }),
            });
        } catch (error) {
            // Revert on error
            setAgents(prev => prev.map(a => a.id === id ? { ...a, enabled: currentStatus } : a));
            console.error("Failed to toggle agent", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this agent?")) return;
        try {
            await fetch(`/api/agents/${id}`, { method: "DELETE" });
            setAgents(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleRun = async (id: string) => {
        setRunningId(id);
        try {
            const res = await fetch(`/api/agents/${id}/run`, { method: "POST" });
            const data = await res.json();
            if (data.success) {
                alert(`Agent executed successfully: ${data.data.result.status}`);
                fetchAgents(); // Refresh to show new log
            } else {
                alert(`Execution failed: ${data.error}`);
            }
        } catch (error) {
            alert("Execution error");
        } finally {
            setRunningId(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Automation Agents</h2>
                <div className="flex gap-2">
                    <Link href="/dashboard/agents/logs">
                        <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            View Logs
                        </Button>
                    </Link>
                    <Link href="/dashboard/agents/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Agent
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Installed Agents</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Last Run</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Loading agents...</TableCell>
                                </TableRow>
                            ) : agents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No agents installed. Create one to get started.</TableCell>
                                </TableRow>
                            ) : (
                                agents.map((agent) => {
                                    const lastLog = agent.logs?.[0];
                                    return (
                                        <TableRow key={agent.id}>
                                            <TableCell>
                                                <Switch
                                                    checked={agent.enabled}
                                                    onCheckedChange={() => handleToggle(agent.id, agent.enabled)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {agent.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {AGENT_TYPE_LABELS[agent.type]}
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
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleRun(agent.id)}
                                                        disabled={!agent.enabled || runningId === agent.id}
                                                        title="Run Manually"
                                                    >
                                                        {runningId === agent.id ? (
                                                            <RotateCw className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Play className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Link href={`/dashboard/agents/${agent.id}/edit`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600"
                                                        onClick={() => handleDelete(agent.id)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
