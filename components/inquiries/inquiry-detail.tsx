"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InquiryDetailProps {
    inquiry: any;
    users: any[];
}

export function InquiryDetail({ inquiry: initialInquiry, users }: InquiryDetailProps) {
    const router = useRouter();
    const [inquiry, setInquiry] = useState(initialInquiry);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (updates: any) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/inquiries/${inquiry.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (!res.ok) throw new Error('Failed to update');
            const updated = await res.json();
            setInquiry(updated);
            router.refresh(); // Refresh server state if needed
        } catch (error) {
            alert("Error updating");
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;
        await handleUpdate({ note });
        setNote("");
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Inquiry Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground">Name</Label>
                                <div className="font-medium">{inquiry.name}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Email</Label>
                                <div className="font-medium">{inquiry.email}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Phone</Label>
                                <div>{inquiry.phone || '-'}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Product</Label>
                                <div>{inquiry.product?.title || '-'}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Date</Label>
                                <div>{new Date(inquiry.createdAt).toLocaleString()}</div>
                            </div>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Message</Label>
                            <div className="mt-1 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                                {inquiry.message}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            {(inquiry.notes as any[])?.map((bgNote: any, i: number) => (
                                <div key={i} className="bg-muted p-3 rounded-md text-sm">
                                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                        <span>{bgNote.author}</span>
                                        <span>{new Date(bgNote.date).toLocaleString()}</span>
                                    </div>
                                    <p>{bgNote.text}</p>
                                </div>
                            ))}
                            {(!inquiry.notes || (inquiry.notes as any[]).length === 0) && (
                                <div className="text-sm text-muted-foreground">No notes yet.</div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Add Note</Label>
                            <Textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Internal note..."
                            />
                            <Button size="sm" onClick={handleAddNote} disabled={loading || !note.trim()}>
                                Add Note
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={inquiry.status}
                                onChange={(e) => handleUpdate({ status: e.target.value })}
                                disabled={loading}
                            >
                                <option value="NEW">New</option>
                                <option value="CONTACTED">Contacted</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Assigned To</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={inquiry.assignedToId || ""}
                                onChange={(e) => handleUpdate({ assignedToId: e.target.value || null })}
                                disabled={loading}
                            >
                                <option value="">Unassigned</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name || u.email}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
