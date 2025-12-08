"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHART_COLORS } from "@/constants/chartColors";

export function InquiryChart() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/analytics/inquiries")
            .then((res) => res.json())
            .then((apiData) => {
                if (apiData.statusCounts) {
                    const formatted = Object.keys(apiData.statusCounts).map((key) => ({
                        name: key,
                        value: apiData.statusCounts[key],
                    }));
                    setData(formatted);
                }
            });
    }, []);

    const COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.accent, CHART_COLORS.neutral];

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Inquiry Status</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
