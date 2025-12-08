export function parseQueryFilters(url: URL) {
    const searchParams = url.searchParams;
    const filters: any = {};

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (from || to) {
        filters.createdAt = {};
        if (from) filters.createdAt.gte = new Date(from);
        if (to) filters.createdAt.lte = new Date(to);
    }

    // Generic filters
    const status = searchParams.get("status");
    if (status) filters.status = status;

    const featured = searchParams.get("featured");
    if (featured !== null) filters.featured = featured === "true";

    const agentId = searchParams.get("agentId");
    if (agentId) filters.assignedToId = agentId; // Assuming relation

    const type = searchParams.get("type");
    if (type) filters.type = type;

    return filters;
}
