import prisma from "@/lib/prisma";
import { InquiryStatus, AgentType } from "@prisma/client";

export class AnalyticsService {
    static async getProductMetrics() {
        const totalProducts = await prisma.product.count();
        const featuredProducts = await prisma.product.count({
            where: { featured: true },
        });
        const latestProducts = await prisma.product.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: { title: true, createdAt: true },
        });

        return {
            totalProducts,
            featuredProducts,
            latestProducts,
        };
    }

    static async getInquiryMetrics() {
        const totalInquiries = await prisma.inquiry.count();

        // Group by status
        const statusCounts = await prisma.inquiry.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
        });

        // Format status counts
        const statusMap = {
            [InquiryStatus.NEW]: 0,
            [InquiryStatus.CONTACTED]: 0,
            [InquiryStatus.CLOSED]: 0,
        };

        statusCounts.forEach((item) => {
            statusMap[item.status] = item._count.status;
        });

        return {
            totalInquiries,
            statusCounts: statusMap,
        };
    }

    static async getAgentMetrics() {
        const totalAgents = await prisma.agent.count();
        const activeAgents = await prisma.agent.count({
            where: { enabled: true },
        });

        // Mocking agent actions/success from logs (as logs are JSON)
        // In a real scenario, we'd query structured logs or a separate AgentLog table.
        // Here we'll just return basic agent stats.

        return {
            totalAgents,
            activeAgents,
            // Mock data for charts
            actionsHistory: [
                { date: "2023-10-01", success: 10, failure: 2 },
                { date: "2023-10-02", success: 15, failure: 1 },
                { date: "2023-10-03", success: 8, failure: 0 },
                { date: "2023-10-04", success: 12, failure: 3 },
                { date: "2023-10-05", success: 20, failure: 5 },
            ]
        };
    }

    static async getLeadMetrics() {
        // Assuming Leads are inquiries with status NEW or others.
        // Or if we had a separate Lead model. 
        // Requirement says: total leads generated, lead conversion %

        const totalLeads = await prisma.inquiry.count();
        const closedLeads = await prisma.inquiry.count({
            where: { status: InquiryStatus.CLOSED },
        });

        const conversionRate = totalLeads > 0 ? (closedLeads / totalLeads) * 100 : 0;

        return {
            totalLeads,
            featuredLeads: 0, // Placeholder
            conversionRate: parseFloat(conversionRate.toFixed(2)),
            closedLeads,
        };
    }
}
