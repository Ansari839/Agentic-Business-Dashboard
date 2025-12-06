import { getInquiryById } from "@/services/inquiry.service";
import { getUsersByRole } from "@/services/user.service";
import { Role } from "@/constants/roles";
import { notFound } from "next/navigation";
import { InquiryDetail } from "@/components/inquiries/inquiry-detail";

export default async function InquiryDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const [inquiry, users] = await Promise.all([
        getInquiryById(params.id),
        getUsersByRole([Role.SALES, Role.ADMIN, Role.SUPERADMIN]), // Allow assigning to anyone above SALES
    ]);

    if (!inquiry) {
        notFound();
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Inquiry Details</h2>
            </div>
            <InquiryDetail inquiry={inquiry} users={users} />
        </div>
    );
}
