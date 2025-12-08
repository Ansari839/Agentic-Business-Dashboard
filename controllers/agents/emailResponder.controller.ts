import { NextRequest, NextResponse } from "next/server";
import { emailResponderService } from "@/services/agents/emailResponder.service";

export const getConfig = async () => {
    try {
        const config = await emailResponderService.getConfig();
        return NextResponse.json({ success: true, data: config });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};

export const updateConfig = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const config = await emailResponderService.updateConfig(body);
        return NextResponse.json({ success: true, data: config });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};

export const deleteConfig = async () => {
    try {
        await emailResponderService.clearConfig();
        return NextResponse.json({ success: true, message: "Config cleared" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};

export const runAgent = async (req: NextRequest) => {
    try {
        const body = await req.json();
        // Body expected to have { inquiryIds, tone, autoSend, cc, instructions } or inside 'config' key?
        // Let's assume the body IS the config for the run.
        const { inquiryIds, tone, autoSend, cc, instructions } = body;

        if (!inquiryIds || !Array.isArray(inquiryIds) || inquiryIds.length === 0) {
            return NextResponse.json({ success: false, error: "No inquiry IDs provided" }, { status: 400 });
        }

        const result = await emailResponderService.run({
            inquiryIds,
            tone: tone || 'Professional',
            autoSend: autoSend ?? false,
            cc,
            instructions
        });

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};
