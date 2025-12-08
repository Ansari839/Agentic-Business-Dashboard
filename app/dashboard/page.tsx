"use client";

import { ProductMetrics } from "./analytics/widgets/ProductMetrics";
import { InquiryMetrics } from "./analytics/widgets/InquiryMetrics";
import { LeadMetrics } from "./analytics/widgets/LeadMetrics";
import { AgentMetrics } from "./analytics/widgets/AgentMetrics";
import { ProductChart } from "./analytics/charts/ProductChart";
import { InquiryChart } from "./analytics/charts/InquiryChart";
import { AgentChart } from "./analytics/charts/AgentChart";

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    {/* Date Range Picker Placeholder */}
                    <button className="text-sm border p-2 rounded">Date Range</button>
                    <button className="text-sm bg-primary text-primary-foreground p-2 rounded">Download</button>
                </div>
            </div>

            <div className="space-y-4">
                {/* Metric Widgets Grid - 4 columns */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <ProductMetrics />
                    <InquiryMetrics />
                    <LeadMetrics />
                    <AgentMetrics />
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <ProductChart />
                    <InquiryChart />
                </div>

                {/* Additional Charts */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <AgentChart />
                </div>
            </div>
        </div>
    );
}
