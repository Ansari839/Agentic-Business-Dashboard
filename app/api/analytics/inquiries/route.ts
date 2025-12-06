import { NextResponse } from "next/server";
import { AnalyticsController } from "@/controllers/analytics.controller";

export async function GET(request: Request) {
    return AnalyticsController.getInquiries(request);
}
