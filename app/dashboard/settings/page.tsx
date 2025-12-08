"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeTable from "@/components/settings/EmployeeTable";
import FeatureToggles from "@/components/settings/FeatureToggles";

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            </div>
            <Tabs defaultValue="employees" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="employees">Employees</TabsTrigger>
                    <TabsTrigger value="features">Feature Toggles</TabsTrigger>
                </TabsList>
                <TabsContent value="employees" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Employee Management</CardTitle>
                            <CardDescription>
                                Manage employee roles, status, and API limits.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <EmployeeTable />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="features" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Feature Toggles</CardTitle>
                            <CardDescription>
                                Enable or disable global features.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FeatureToggles />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
