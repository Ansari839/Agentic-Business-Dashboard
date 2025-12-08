"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductChart() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Mocking trend data for now as DB doesn't have historical snapshots
        setData([
            { name: "Jan", products: 12 },
            { name: "Feb", products: 19 },
            { name: "Mar", products: 25 },
            { name: "Apr", products: 32 },
            { name: "May", products: 40 },
            { name: "Jun", products: 45 },
        ]);
    }, []);

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Product Growth</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <Tooltip />
                        <Bar dataKey="products" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
