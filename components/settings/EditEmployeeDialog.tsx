"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SERVICES, DEFAULT_API_LIMITS } from "@/constants/defaultApiLimits";

interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    apiLimits: Record<string, number> | null;
    featureFlags: Record<string, boolean> | null;
}

interface EditEmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee: Employee;
    onSave: () => void;
}

export default function EditEmployeeDialog({ open, onOpenChange, employee, onSave }: EditEmployeeDialogProps) {
    const [role, setRole] = useState(employee.role);
    const [isActive, setIsActive] = useState(employee.isActive);
    const [limits, setLimits] = useState<Record<string, number>>(employee.apiLimits || DEFAULT_API_LIMITS);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setRole(employee.role);
        setIsActive(employee.isActive);
        setLimits(employee.apiLimits || DEFAULT_API_LIMITS);
    }, [employee]);

    const handleLimitChange = (service: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setLimits(prev => ({ ...prev, [service]: numValue }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/settings/employees/${employee.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role,
                    isActive,
                    apiLimits: limits
                })
            });

            if (res.ok) {
                onSave();
            } else {
                console.error("Failed to update employee");
            }
        } catch (error) {
            console.error("Error updating employee:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Employee</DialogTitle>
                    <DialogDescription>
                        Update profile, role, and API limits for {employee.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value={employee.name} disabled className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Role
                        </Label>
                        <div className="col-span-3">
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="SALES">Sales</SelectItem>
                                    <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="active" className="text-right">
                            Active
                        </Label>
                        <div className="col-span-3 flex items-center space-x-2">
                            <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
                            <Label htmlFor="active">{isActive ? 'Yes' : 'No'}</Label>
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-2">
                        <h4 className="mb-4 text-sm font-medium leading-none">API Limits</h4>
                        {SERVICES.map((service) => (
                            <div key={service} className="grid grid-cols-4 items-center gap-4 mb-2">
                                <Label htmlFor={`limit-${service}`} className="text-right text-xs">
                                    {service}
                                </Label>
                                <Input
                                    id={`limit-${service}`}
                                    type="number"
                                    value={limits[service] ?? 0}
                                    onChange={(e) => handleLimitChange(service, e.target.value)}
                                    className="col-span-3 h-8"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
