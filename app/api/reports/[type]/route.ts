import { ReportController } from "@/controllers/report.controller";

export async function GET(req: Request, context: { params: Promise<{ type: string }> }) {
    // Await params if using Next.js 15+ style where params is a promise
    // Based on user metadata, Next version is 16.0.6, so params is a Promise.
    const { type } = await context.params;
    return ReportController.exportReport(req, type);
}
