export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
    }).format(num);
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};
