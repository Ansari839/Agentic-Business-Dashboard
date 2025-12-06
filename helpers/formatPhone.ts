export function formatPhone(phone: string | null | undefined): string {
    if (!phone) return '-';

    // Remove non-numeric chars
    const cleaned = ('' + phone).replace(/\D/g, '');

    // Check if it's a standard US number (10 digits)
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }

    // Return original if no match or add simple formatting for others
    return phone;
}
