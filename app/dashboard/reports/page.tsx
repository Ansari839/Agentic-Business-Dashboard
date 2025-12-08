"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText } from "lucide-react";


export default function ReportsPage() {

    const handleExport = (type: string, format: "csv" | "pdf", filters: any) => {
        const params = new URLSearchParams({ format });

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== "ALL" && value !== "all") {
                params.append(key, value as string);
            }
        });

        const url = `/api/reports/${type}?${params.toString()}`;

        // Trigger download
        window.open(url, "_blank");

        // Show success toast
        // Note: We can't easily know if the download actually succeeded from window.open
        // but this gives feedback that the action was taken.
        // toast({ title: "Export Started", description: `Exporting ${type} as ${format.toUpperCase()}` });
        // Commented out toast because useToast hook is missing as discovered in previous tasks
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Export Reports</h2>

            <Tabs defaultValue="products" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
                    <TabsTrigger value="leads">Leads</TabsTrigger>
                    <TabsTrigger value="agents">Agents</TabsTrigger>
                </TabsList>

                {/* Products Report */}
                <TabsContent value="products" className="space-y-4">
                    <ReportSection
                        title="Product Reports"
                        type="products"
                        onExport={handleExport}
                        filtersSlot={(filters, setFilters) => (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label>Featured</Label>
                                    <Select
                                        onValueChange={(val) => setFilters({ ...filters, featured: val })}
                                        defaultValue={filters.featured}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="true">Featured Only</SelectItem>
                                            <SelectItem value="false">Standard Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    />
                </TabsContent>

                {/* Inquiries Report */}
                <TabsContent value="inquiries" className="space-y-4">
                    <ReportSection
                        title="Inquiry Reports"
                        type="inquiries"
                        onExport={handleExport}
                        filtersSlot={(filters, setFilters) => (
                            <>
                                <DateRangeFilters filters={filters} setFilters={setFilters} />
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select
                                            onValueChange={(val) => setFilters({ ...filters, status: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All</SelectItem>
                                                <SelectItem value="NEW">New</SelectItem>
                                                <SelectItem value="CONTACTED">Contacted</SelectItem>
                                                <SelectItem value="CLOSED">Closed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </>
                        )}
                    />
                </TabsContent>

                {/* Leads Report */}
                <TabsContent value="leads" className="space-y-4">
                    <ReportSection
                        title="Lead Reports"
                        type="leads"
                        onExport={handleExport}
                        filtersSlot={(filters, setFilters) => (
                            <DateRangeFilters filters={filters} setFilters={setFilters} />
                        )}
                    />
                </TabsContent>

                {/* Agents Report */}
                <TabsContent value="agents" className="space-y-4">
                    <ReportSection
                        title="Agent Reports"
                        type="agents"
                        onExport={handleExport}
                        filtersSlot={(filters, setFilters) => (
                            <div className="space-y-4">
                                <DateRangeFilters filters={filters} setFilters={setFilters} />
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label>Agent Type</Label>
                                        <Select
                                            onValueChange={(val) => setFilters({ ...filters, type: val })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ALL">All</SelectItem>
                                                <SelectItem value="LEAD_GEN">Lead Gen</SelectItem>
                                                <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
                                                <SelectItem value="EMAIL_RESPONDER">Email Responder</SelectItem>
                                                <SelectItem value="CHAT_SUPPORT">Chat Support</SelectItem>
                                                <SelectItem value="SEO">SEO</SelectItem>
                                                <SelectItem value="IMAGE_FIXER">Image Fixer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function DateRangeFilters({ filters, setFilters }: { filters: any, setFilters: (f: any) => void }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                    type="date"
                    value={filters.from || ''}
                    onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                    type="date"
                    value={filters.to || ''}
                    onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                />
            </div>
        </div>
    );
}

interface ReportSectionProps {
    title: string;
    type: string;
    onExport: (type: string, format: "csv" | "pdf", filters: any) => void;
    filtersSlot: (filters: any, setFilters: (f: any) => void) => React.ReactNode;
}

function ReportSection({ title, type, onExport, filtersSlot }: ReportSectionProps) {
    const [filters, setFilters] = useState<any>({});

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-slate-900/50">
                        {filtersSlot(filters, setFilters)}
                    </div>

                    <div className="flex gap-4">
                        <Button onClick={() => onExport(type, "csv", filters)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                        <Button variant="outline" onClick={() => onExport(type, "pdf", filters)}>
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
