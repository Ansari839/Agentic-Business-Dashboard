
import 'dotenv/config';
import { SettingsService } from '../services/settings.service';
import { AuditLogService } from '../services/auditLog.service';
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
    console.log("--- Verifying Settings ---");
    const employees = await SettingsService.getEmployees();
    const admin = employees.find(e => e.email === 'admin@example.com');
    console.log("Admin API Limits:", admin?.apiLimits);
    console.log("Admin Feature Flags:", admin?.featureFlags);

    if ((admin?.apiLimits as any)?.LEAD_GEN === 1000) console.log("✅ Admin Limits Verified");
    else console.error("❌ Admin Limits Mismatch");

    const features = await SettingsService.getFeatures();
    console.log("Global Features:", features);

    console.log("\n--- Verifying Audit Logs ---");
    const logsData = await AuditLogService.getLogs({ page: 1, pageSize: 50 });
    console.log("Total Logs:", logsData.pagination.total);
    if (logsData.pagination.total >= 3) console.log("✅ Audit Logs Populated");
    else console.error("❌ Audit Logs Missing");

    console.log("\n--- Verifying Reports Data ---");
    const inquiryCount = await prisma.inquiry.count();
    console.log("Total Inquiries:", inquiryCount);
    if (inquiryCount >= 10) console.log("✅ Inquiries for Reports Verified");

    // Explicitly check Reports export logic via DB count (Reports logic aggregates inquiries)

    process.exit(0);
}

verify().catch(console.error);
