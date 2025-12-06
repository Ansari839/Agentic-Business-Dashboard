export interface LogEntry {
    timestamp: string;
    status: 'SUCCESS' | 'ERROR' | 'INFO';
    message: string;
    details?: any;
}

export function formatLogDate(isoString: string): string {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleString();
}
