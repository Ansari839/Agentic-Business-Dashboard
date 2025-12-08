export function generateCSV(data: any[], fields: string[]): string {
    if (!data || data.length === 0) {
        return "";
    }

    const header = fields.join(",");
    const rows = data.map((row) =>
        fields
            .map((field) => {
                const value = row[field] !== undefined && row[field] !== null ? row[field] : "";
                // Escape quotes and wrap in quotes if contains comma
                const stringValue = String(value);
                if (stringValue.includes(",") || stringValue.includes('"')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            })
            .join(",")
    );

    return [header, ...rows].join("\n");
}
