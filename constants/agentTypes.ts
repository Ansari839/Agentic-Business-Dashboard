export enum AgentType {
    LEAD_GEN = 'LEAD_GEN',
    LINKEDIN = 'LINKEDIN',
    EMAIL_RESPONDER = 'EMAIL_RESPONDER',
    CHAT_SUPPORT = 'CHAT_SUPPORT',
    SEO = 'SEO',
    IMAGE_FIXER = 'IMAGE_FIXER',
}

export const AGENT_TYPE_LABELS: Record<AgentType, string> = {
    [AgentType.LEAD_GEN]: 'Lead Generation',
    [AgentType.LINKEDIN]: 'LinkedIn Automation',
    [AgentType.EMAIL_RESPONDER]: 'Email Responder',
    [AgentType.CHAT_SUPPORT]: 'Chat Support',
    [AgentType.SEO]: 'SEO Optimizer',
    [AgentType.IMAGE_FIXER]: 'Image Fixer',
};

export const AGENT_DESCRIPTIONS: Record<AgentType, string> = {
    [AgentType.LEAD_GEN]: 'Automatically generates leads for your products based on criteria.',
    [AgentType.LINKEDIN]: 'Sends connection requests and messages on LinkedIn.',
    [AgentType.EMAIL_RESPONDER]: 'Automatically replies to product inquiries.',
    [AgentType.CHAT_SUPPORT]: 'Handles live chat queries from website visitors.',
    [AgentType.SEO]: 'Analyzes and updates meta tags and content for better ranking.',
    [AgentType.IMAGE_FIXER]: 'Optimizes images and adds alt text automatically.',
};
