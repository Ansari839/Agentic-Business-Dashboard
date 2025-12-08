"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/helpers/formatNumber";
import { Users, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

export function LeadMetrics() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/analytics/leads")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(data.totalLeads)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <UserCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">From closed inquiries</p>
                </CardContent>
            </Card>
        </>
    );
}
