export const calculatePercentage = (part: number, total: number): string => {
    if (total === 0) return "0%";
    return `${Math.round((part / total) * 100)}%`;
};

export const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};
