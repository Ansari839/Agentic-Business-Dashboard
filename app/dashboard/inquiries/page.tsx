"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { formatPhone } from "@/helpers/formatPhone";

interface Inquiry {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: string;
    product: { title: string } | null;
    assignedTo: { name: string } | null;
    createdAt: string;
}

interface Product {
    id: string;
    title: string;
}

export default function InquiriesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // URL params state
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const productId = searchParams.get("productId") || "";

    const [searchTerm, setSearchTerm] = useState(search);
    const [statusFilter, setStatusFilter] = useState(status);
    const [productFilter, setProductFilter] = useState(productId);

    // Fetch Products for Filter
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products?limit=100");
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchInquiries = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    page: page.toString(),
                    limit: "10",
                    search: search,
                    ...(status && { status }),
                    ...(productId && { productId }),
                });
                const res = await fetch(`/api/inquiries?${query.toString()}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setInquiries(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchInquiries();
    }, [page, search, status, productId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateParams({ search: searchTerm, page: 1 });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setStatusFilter(val);
        updateParams({ status: val, page: 1 });
    }

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setProductFilter(val);
        updateParams({ productId: val, page: 1 });
    }

    const updateParams = (updates: any) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        });
        router.push(`/dashboard/inquiries?${params.toString()}`);
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Inquiries</h2>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <CardTitle className="pt-2">List</CardTitle>
                        <div className="flex flex-wrap gap-2">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input
                                    placeholder="Search name/email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-[200px]"
                                />
                                <Button type="submit" size="icon">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                            <select
                                className="flex h-10 w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={statusFilter}
                                onChange={handleStatusChange}
                            >
                                <option value="">All Statuses</option>
                                <option value="NEW">New</option>
                                <option value="CONTACTED">Contacted</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                            <select
                                className="flex h-10 w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={productFilter}
                                onChange={handleProductChange}
                            >
                                <option value="">All Products</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : inquiries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">No inquiries found.</TableCell>
                                </TableRow>
                            ) : (
                                inquiries.map((inquiry) => (
                                    <TableRow key={inquiry.id}>
                                        <TableCell>{inquiry.product?.title || '-'}</TableCell>
                                        <TableCell className="font-medium">{inquiry.name}</TableCell>
                                        <TableCell>{inquiry.email}</TableCell>
                                        <TableCell>{formatPhone(inquiry.phone)}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${inquiry.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                                                inquiry.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {inquiry.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{inquiry.assignedTo?.name || 'Unassigned'}</TableCell>
                                        <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/inquiries/${inquiry.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateParams({ page: page - 1 })}
                            disabled={page <= 1 || loading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="text-sm">Page {page}</div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateParams({ page: page + 1 })}
                            disabled={inquiries.length < 10 || loading}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
