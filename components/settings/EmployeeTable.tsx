"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2 } from "lucide-react";
import EditEmployeeDialog from "./EditEmployeeDialog";

interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    apiLimits: Record<string, number> | null;
    featureFlags: Record<string, boolean> | null;
}

export default function EmployeeTable() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings/employees");
            const data = await res.json();
            if (Array.isArray(data)) {
                setEmployees(data);
            }
        } catch (error) {
            console.error("Failed to fetch employees", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setOpenDialog(true);
    };

    const handleSave = () => {
        setOpenDialog(false);
        fetchEmployees();
    };

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell>
                            </TableRow>
                        ) : employees.map((emp) => (
                            <TableRow key={emp.id}>
                                <TableCell className="font-medium">{emp.name}</TableCell>
                                <TableCell>{emp.email}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{emp.role}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={emp.isActive ? "default" : "destructive"}>
                                        {emp.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(emp)}>
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {selectedEmployee && (
                <EditEmployeeDialog
                    open={openDialog}
                    onOpenChange={setOpenDialog}
                    employee={selectedEmployee}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
