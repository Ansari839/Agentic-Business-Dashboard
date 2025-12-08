import { NextResponse } from "next/server";
import { AgentTemplateService } from "@/services/agentTemplate.service";

export class AgentTemplateController {
    static async listTemplates() {
        try {
            const templates = AgentTemplateService.getAllTemplates();
            return NextResponse.json(templates);
        } catch (error) {
            return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
        }
    }

    static async getTemplate(req: Request, { params }: { params: { id: string } }) {
        try {
            const template = AgentTemplateService.getTemplateById(params.id);
            if (!template) {
                return NextResponse.json({ error: "Template not found" }, { status: 404 });
            }
            return NextResponse.json(template);
        } catch (error) {
            return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
        }
    }
}
