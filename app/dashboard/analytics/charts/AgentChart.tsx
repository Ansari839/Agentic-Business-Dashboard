"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/constants/chartColors";

export function AgentChart() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/analytics/agents")
            .then((res) => res.json())
            .then((apiData) => {
                if (apiData.actionsHistory) {
                    setData(apiData.actionsHistory);
                }
            });
    }, []);

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Agent Actions</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="success" stroke={CHART_COLORS.secondary} strokeWidth={2} />
                        <Line type="monotone" dataKey="failure" stroke={CHART_COLORS.destructive} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
