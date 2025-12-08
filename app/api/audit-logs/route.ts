import { AuditLogController } from "@/controllers/auditLog.controller";

export async function GET(req: Request) {
    return AuditLogController.getLogs(req);
}
