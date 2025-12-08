import { NextResponse } from "next/server";
import { AuditLogService } from "@/services/auditLog.service";

export class AuditLogController {
    static async getLogs(req: Request) {
        try {
            const url = new URL(req.url);
            const page = parseInt(url.searchParams.get("page") || "1");
            const pageSize = parseInt(url.searchParams.get("pageSize") || "20");
            const action = url.searchParams.get("action") || undefined;
            const userId = url.searchParams.get("userId") || undefined;
            const entity = url.searchParams.get("entity") || undefined;
            const from = url.searchParams.get("from") || undefined;
            const to = url.searchParams.get("to") || undefined;

            const result = await AuditLogService.getLogs({
                page,
                pageSize,
                action,
                userId,
                entity,
                from,
                to,
            });

            return NextResponse.json(result);
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
}
