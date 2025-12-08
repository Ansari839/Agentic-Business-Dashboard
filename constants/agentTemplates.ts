import { AgentType } from "./agentTypes";

export interface AgentTemplate {
    id: string;
    name: string;
    type: AgentType;
    baseURL: string;
    description: string;
    config: any;
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
    {
        id: "1",
        name: "Lead Generation Agent",
        type: AgentType.LEAD_GEN,
        baseURL: "/agents/lead-gen",
        description: "Generates product-related leads per area.",
        config: { task: "generate leads", params: { area: "", products: [] } }
    },
    {
        id: "2",
        name: "LinkedIn Agent",
        type: AgentType.LINKEDIN,
        baseURL: "/agents/linkedin",
        description: "Sends product messages to LinkedIn buyers.",
        config: { task: "send messages", params: { keywords: [], connectionRequestMessage: "" } }
    },
    {
        id: "3",
        name: "Email Responder Agent",
        type: AgentType.EMAIL_RESPONDER,
        baseURL: "/agents/email-responder",
        description: "Responds to inquiries automatically via email.",
        config: { task: "respond to emails", params: { templates: [] } }
    },
    {
        id: "4",
        name: "Chat Support Agent",
        type: AgentType.CHAT_SUPPORT,
        baseURL: "/agents/chat-support",
        description: "Handles web chat customer queries.",
        config: { task: "chat support", params: { tone: "professional" } }
    },
    {
        id: "5",
        name: "SEO Agent",
        type: AgentType.SEO,
        baseURL: "/agents/seo",
        description: "Optimizes product content, updates meta tags/keywords.",
        config: { task: "optimize seo", params: { targetKeywords: [] } }
    },
    {
        id: "6",
        name: "Image Fixer Agent",
        type: AgentType.IMAGE_FIXER,
        baseURL: "/agents/image-fixer",
        description: "Fixes image size, alt text, file names.",
        config: { task: "fix images", params: { optimizeSize: true } }
    }
];
