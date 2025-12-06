"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/helpers/formatNumber";
import { Bot, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function AgentMetrics() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/analytics/agents")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                    <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(data.activeAgents)} / {data.totalAgents}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                    <Zap className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">100+</div>
                    <p className="text-xs text-muted-foreground">Mocked Data</p>
                </CardContent>
            </Card>
        </>
    );
}
