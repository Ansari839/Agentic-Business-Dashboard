"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureToggle {
    id: string;
    key: string;
    label: string;
    isEnabled: boolean;
    description: string | null;
}

export default function FeatureToggles() {
    const [features, setFeatures] = useState<FeatureToggle[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeatures = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings/features");
            const data = await res.json();
            if (Array.isArray(data)) {
                setFeatures(data);
            }
        } catch (error) {
            console.error("Failed to fetch features", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    const toggleFeature = async (key: string, currentStatus: boolean) => {
        // Optimistic update
        setFeatures(prev => prev.map(f => f.key === key ? { ...f, isEnabled: !currentStatus } : f));

        try {
            const res = await fetch("/api/settings/features", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, isEnabled: !currentStatus })
            });
            if (!res.ok) {
                // Revert if failed
                setFeatures(prev => prev.map(f => f.key === key ? { ...f, isEnabled: currentStatus } : f));
                console.error("Failed to update feature");
            }
        } catch (error) {
            setFeatures(prev => prev.map(f => f.key === key ? { ...f, isEnabled: currentStatus } : f));
            console.error("Error updating feature:", error);
        }
    };

    // Default features if none exist (for demo/init)
    const knownFeatures = [
        { key: "chat_agent", label: "AI Chat Agent" },
        { key: "seo_optimizer", label: "SEO Optimizer" },
        { key: "export_reports", label: "Export Reports" },
        { key: "email_responder", label: "Email Responder" },
    ];

    // Merge known features with DB features to show controls even if DB is empty initially
    const displayFeatures = knownFeatures.map(kf => {
        const dbFeature = features.find(f => f.key === kf.key);
        return dbFeature || { ...kf, id: kf.key, isEnabled: true, description: null };
    });

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayFeatures.map((feature) => (
                <Card key={feature.key}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor={feature.key} className="text-base font-medium">
                                    {feature.label}
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    {feature.description || `Enable/disable ${feature.label} globally.`}
                                </span>
                            </div>
                            <Switch
                                id={feature.key}
                                checked={feature.isEnabled}
                                onCheckedChange={() => toggleFeature(feature.key, feature.isEnabled)}
                            />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
