"use client";
onChange = { e => setConfig({ ...config, keywords: e.target.value.split(',').map((s: string) => s.trim()) })}
placeholder = "e.g. best products, buy online"
    />
                </div >
            );
        case AgentType.LINKEDIN:
return (
    <>
        <div className="space-y-2">
            <Label>Target Audience</Label>
            <Input
                value={config.targetAudience || ''}
                onChange={e => setConfig({ ...config, targetAudience: e.target.value })}
                placeholder="e.g. CTOs, Founders"
            />
        </div>
        <div className="space-y-2">
            <Label>Message Template</Label>
            <Textarea
                value={config.connectionRequestMessage || ''}
                onChange={e => setConfig({ ...config, connectionRequestMessage: e.target.value })}
                placeholder="Hi {name}, ..."
            />
        </div>
    </>
);
        // Add more cases for other agent types
        default:
return (
    <div className="space-y-2">
        <Label>Additional Configuration</Label>
        <Textarea
            value={JSON.stringify(config, null, 2)}
            readOnly
            className="bg-muted text-muted-foreground font-mono text-xs"
        />
        <p className="text-xs text-muted-foreground">Generic runner for this agent type.</p>
    </div>
);
    }
}

return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Run {agent?.name}</DialogTitle>
                    <DialogDescription>
                        Configure runtime parameters for this {agent?.type} agent.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {renderFields()}
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Running..." : "Run Agent"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
);
}
