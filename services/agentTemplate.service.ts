import { AGENT_TEMPLATES } from "@/constants/agentTemplates";

export class AgentTemplateService {
    static getAllTemplates() {
        return AGENT_TEMPLATES.map(({ config, ...rest }) => rest); // Exclude heavy config for list view if needed, but here it's small so maybe fine. 
        // For requirements "Response example" in user prompt showed full objects without config initially? 
        // User prompt example: { "id": "1", "name": "Lead Generation Agent", "type": "LEAD_GEN", "baseURL": "/agents/lead-gen", "description": "Generates product leads" }
        // It didn't have config. So I will exclude it for list.
    }

    static getTemplateById(id: string) {
        return AGENT_TEMPLATES.find(t => t.id === id);
    }
}
