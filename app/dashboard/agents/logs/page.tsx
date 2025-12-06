"use client";

import { useEffect, useState } from "react";
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
import { AgentType, AGENT_TYPE_LABELS } from "@/constants/agentTypes";
import { formatLogDate } from "@/helpers/formatLogs";

interface LogEntry {
    timestamp: string;
    status: string;
    message: string;
    details: any;
}

interface AgentLog {
    id: string;
    name: string;
    type: AgentType;
    logs: LogEntry[];
}

export default function AgentLogsPage() {
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/agents");
                const data = await res.json();
                if (data.success) {
                    // Flatten logs
                    setLogs(data.data.filter((a: any) => a.logs?.length > 0));
                }
            } catch (error) {
                console.error("Failed to fetch logs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Execution Logs</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Agent</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Message</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Loading logs...</TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No logs found.</TableCell>
                                </TableRow>
                            ) : (
                                logs.flatMap(agent =>
                                    agent.logs.map((log, idx) => (
                                        <TableRow key={`${agent.id}-${idx}`}>
                                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                                {formatLogDate(log.timestamp)}
                                            </TableCell>
                                            <TableCell>{agent.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-xs">
                                                    {AGENT_TYPE_LABELS[agent.type]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className={log.status === 'ERROR' ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                                                    {log.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-sm max-w-[400px] truncate" title={log.message}>
                                                {log.message}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ).sort((a, b) => new Date(b.key?.toString().split('-')[0] || '').getTime() - new Date(a.key?.toString().split('-')[0] || '').getTime()) // Sort by latest (approx approach, ideally use timestamp from data)
                                    .splice(0, 100) // Show last 100
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
