import { NextResponse } from "next/server";
import { AnalyticsService } from "@/services/analytics.service";

export class AnalyticsController {
    static async getProducts(req: Request) {
        try {
            const data = await AnalyticsService.getProductMetrics();
            return NextResponse.json(data);
        } catch (error) {
            console.error("Error fetching product analytics:", error);
            return NextResponse.json(
                { error: "Failed to fetch product analytics" },
                { status: 500 }
            );
        }
    }

    static async getInquiries(req: Request) {
        try {
            const data = await AnalyticsService.getInquiryMetrics();
            return NextResponse.json(data);
        } catch (error) {
            console.error("Error fetching inquiry analytics:", error);
            return NextResponse.json(
                { error: "Failed to fetch inquiry analytics" },
                { status: 500 }
            );
        }
    }

    static async getAgents(req: Request) {
        try {
            const data = await AnalyticsService.getAgentMetrics();
            return NextResponse.json(data);
        } catch (error) {
            console.error("Error fetching agent analytics:", error);
            return NextResponse.json(
                { error: "Failed to fetch agent analytics" },
                { status: 500 }
            );
        }
    }

    static async getLeads(req: Request) {
        try {
            const data = await AnalyticsService.getLeadMetrics();
            return NextResponse.json(data);
        } catch (error) {
            console.error("Error fetching lead analytics:", error);
            return NextResponse.json(
                { error: "Failed to fetch lead analytics" },
                { status: 500 }
            );
        }
    }
}
