"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface EmailResponderConfigModalProps {
    agent: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (config: any) => Promise<void>;
}

export function EmailResponderConfigModal({ agent, open, onOpenChange, onSubmit }: EmailResponderConfigModalProps) {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (open) {
            fetchInquiries();
            setSelectedIds([]);
        }
    }, [open]);

    const fetchInquiries = async () => {
        setFetching(true);
        try {
            const res = await fetch("/api/inquiries");
            const data = await res.json();
            if (data.success) {
                // Filter for NEW inquiries only? Requirements don't specify, but makes sense.
                // For now show all to ensure testing is easy.
                setInquiries(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch inquiries", error);
        } finally {
            setFetching(false);
        }
    };

    const handleToggle = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedIds.length === 0) return;

        setLoading(true);
        try {
            await onSubmit({ inquiryIds: selectedIds });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Run {agent?.name}</DialogTitle>
                        <DialogDescription>
                            Select inquiries to automatically respond to.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="mb-2 font-medium text-sm">Pending Inquiries</div>
                        <ScrollArea className="h-[300px] border rounded-md p-4">
                            {fetching ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : inquiries.length === 0 ? (
                                <div className="text-center text-muted-foreground text-sm py-8">
                                    No inquiries found.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {inquiries.map((inquiry) => (
                                        <div key={inquiry.id} className="flex items-start space-x-3">
                                            <Checkbox
                                                id={inquiry.id}
                                                checked={selectedIds.includes(inquiry.id)}
                                                onCheckedChange={() => handleToggle(inquiry.id)}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <Label
                                                    htmlFor={inquiry.id}
                                                    className="font-medium cursor-pointer"
                                                >
                                                    {inquiry.name} <span className="text-muted-foreground font-normal">({inquiry.email})</span>
                                                </Label>
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {inquiry.message}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    Status: {inquiry.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                        <div className="mt-2 text-xs text-muted-foreground text-right">
                            {selectedIds.length} selected
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading || selectedIds.length === 0}>
                            {loading ? "Processing..." : "Run Agent"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
