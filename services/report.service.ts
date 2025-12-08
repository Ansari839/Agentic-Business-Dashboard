import prisma from "@/lib/prisma";
import { PRODUCT_FIELDS, INQUIRY_FIELDS, AGENT_FIELDS, LEAD_FIELDS } from "@/constants/exportFields";

export class ReportService {
    static async getProducts(where: any) {
        const data = await prisma.product.findMany({
            where,
            orderBy: { createdAt: "desc" },
            // Select only fields we want to export + relations if needed
        });
        return { data, fields: PRODUCT_FIELDS };
    }

    static async getInquiries(where: any) {
        const data = await prisma.inquiry.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        return { data, fields: INQUIRY_FIELDS };
    }

    static async getAgents(where: any) {
        const data = await prisma.agent.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        return { data, fields: AGENT_FIELDS };
    }

    static async getLeads(where: any) {
        // Assuming leads are inquiries with parsed status logic or separated
        // Using inquiry table as proxy based on previous conversations
        const data = await prisma.inquiry.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        return { data, fields: LEAD_FIELDS };
    }
}
