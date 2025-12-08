import { NextResponse } from "next/server";
import { ReportService } from "@/services/report.service";
import { parseQueryFilters } from "@/helpers/formatFilters";
import { generateCSV } from "@/helpers/buildCSV";
import { generatePDF } from "@/helpers/buildPDF";

export class ReportController {
    static async exportReport(req: Request, type: string) {
        try {
            const url = new URL(req.url);
            const format = url.searchParams.get("format") || "csv";
            const filters = parseQueryFilters(url);

            let result;
            let filename = `${type}-report-${new Date().toISOString().split("T")[0]}`;

            switch (type) {
                case "products":
                    result = await ReportService.getProducts(filters);
                    break;
                case "inquiries":
                    result = await ReportService.getInquiries(filters);
                    break;
                case "agents":
                    result = await ReportService.getAgents(filters);
                    break;
                case "leads":
                    result = await ReportService.getLeads(filters);
                    break;
                default:
                    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
            }

            if (format === "pdf") {
                const buffer = await generatePDF(result.data, result.fields, `${type.toUpperCase()} Report`);
                return new NextResponse(buffer, {
                    headers: {
                        "Content-Type": "application/pdf",
                        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
                    },
                });
            } else {
                const csv = generateCSV(result.data, result.fields);
                return new NextResponse(csv, {
                    headers: {
                        "Content-Type": "text/csv",
                        "Content-Disposition": `attachment; filename="${filename}.csv"`,
                    },
                });
            }
        } catch (error) {
            console.error("Export Error:", error);
            return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
        }
    }
}
