"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/helpers/formatNumber";
import { MessageSquare, CheckCircle, Circle } from "lucide-react";
import { useEffect, useState } from "react";

export function InquiryMetrics() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/analytics/inquiries")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(data.totalInquiries)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New</CardTitle>
                    <Circle className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(data.statusCounts?.NEW || 0)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Closed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(data.statusCounts?.CLOSED || 0)}</div>
                </CardContent>
            </Card>
        </>
    );
}
