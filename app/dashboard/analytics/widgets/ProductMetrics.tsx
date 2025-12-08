"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/helpers/formatNumber";
import { Package, Star, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function ProductMetrics() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/analytics/products")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(data.totalProducts)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Featured</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(data.featuredProducts)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Newest</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.latestProducts?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Last 7 days</p>
                </CardContent>
            </Card>
        </>
    );
}
