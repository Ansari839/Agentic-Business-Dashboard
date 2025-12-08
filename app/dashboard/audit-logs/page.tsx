"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Filter, Search, Eye } from "lucide-react";
import { ACTION_TYPES } from "@/constants/actionTypes";

interface AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId: string | null;
    details: any;
    ip: string | null;
    createdAt: string;
    user: {
        name: string;
        email: string;
    } | null;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [action, setAction] = useState<string>("ALL");
    const [entity, setEntity] = useState<string>("ALL");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("pageSize", "20");
            if (action && action !== "ALL") params.append("action", action);
            if (entity && entity !== "ALL") params.append("entity", entity);

            const res = await fetch(`/api/audit-logs?${params.toString()}`);
            const data = await res.json();

            if (data.logs) {
                setLogs(data.logs);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, action, entity]);

    const getActionColor = (action: string) => {
        if (action.includes("CREATE")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        if (action.includes("UPDATE")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        if (action.includes("DELETE")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        if (action.includes("ERROR")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        if (action === "LOGIN") return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Activity</CardTitle>
                    <CardDescription>
                        Track all administrative actions and system events.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
                        <div className="w-[200px]">
                            <Select value={entity} onValueChange={setEntity}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Entity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Entities</SelectItem>
                                    <SelectItem value="PRODUCT">Product</SelectItem>
                                    <SelectItem value="INQUIRY">Inquiry</SelectItem>
                                    <SelectItem value="AGENT">Agent</SelectItem>
                                    <SelectItem value="UI_CONTENT">UI Content</SelectItem>
                                    <SelectItem value="AUTH">Auth</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-[250px]">
                            <Select value={action} onValueChange={setAction}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Actions</SelectItem>
                                    {Object.values(ACTION_TYPES).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" onClick={() => { setEntity("ALL"); setAction("ALL"); setPage(1); }}>
                            Reset Filters
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Entity</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Loading logs...
                                        </TableCell>
                                    </TableRow>
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="whitespace-nowrap">
                                                {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                                            </TableCell>
                                            <TableCell>
                                                {log.user ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{log.user.name}</span>
                                                        <span className="text-xs text-muted-foreground">{log.user.email}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">System / Unknown</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getActionColor(log.action)} variant="secondary">
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{log.entity}</span>
                                                    {log.entityId && <span className="text-xs text-muted-foreground font-mono">{log.entityId.slice(0, 8)}...</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>Log Details</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-sm font-medium text-muted-foreground">Log ID</p>
                                                                    <p className="text-sm font-mono">{log.id}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                                                                    <p className="text-sm font-mono">{log.ip || "N/A"}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground mb-2">JSON Payload</p>
                                                                <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
                                                                    {JSON.stringify(log.details, null, 2)}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page - 1)}
                            disabled={page <= 1}
                        >
                            Previous
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(page + 1)}
                            disabled={page >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
