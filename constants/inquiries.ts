export enum InquiryStatus {
    NEW = 'NEW',
    CONTACTED = 'CONTACTED',
    CLOSED = 'CLOSED',
}

export const INQUIRY_STATUSES = [
    { label: 'New', value: InquiryStatus.NEW },
    { label: 'Contacted', value: InquiryStatus.CONTACTED },
    { label: 'Closed', value: InquiryStatus.CLOSED },
];
