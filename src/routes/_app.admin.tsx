import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { adminClient } from "@/lib/api";
import { sourceConnections, pmRouting, type Source } from "@/lib/mock-data";
import { SourceBadge } from "@/components/voc-badges";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, RefreshCw, Send, BarChart3, MailWarning, GitBranch } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin · JisrVOC" }] }),
  component: AdminGate,
});

function AdminGate() {
  const { can } = useAuth();
  if (!can.viewAdmin) return <Navigate to="/access-denied" />;
  return <AdminPage />;
}

const fieldMappings: Record<string, { from: string; to: string }[]> = {
  HubSpot: [
    { from: "ticket.subject", to: "feedback.summary" },
    { from: "ticket.content", to: "feedback.rawText" },
    { from: "ticket.pipeline_stage", to: "feedback.urgency" },
    { from: "contact.company", to: "feedback.customer" },
  ],
  Zendesk: [
    { from: "ticket.subject", to: "feedback.summary" },
    { from: "ticket.description", to: "feedback.rawText" },
    { from: "ticket.priority", to: "feedback.urgency" },
    { from: "organization.name", to: "feedback.customer" },
  ],
  Canny: [
    { from: "post.title", to: "feedback.summary" },
    { from: "post.details", to: "feedback.rawText" },
    { from: "post.score", to: "feedback.voteWeight" },
    { from: "company.name", to: "feedback.customer" },
  ],
  Jira: [
    { from: "issue.summary", to: "feedback.summary" },
    { from: "issue.description", to: "feedback.rawText" },
    { from: "issue.priority", to: "feedback.urgency" },
    { from: "reporter.organization", to: "feedback.customer" },
  ],
};

function AdminPage() {
  const { can } = useAuth();
  const [syncDrawer, setSyncDrawer] = useState<Source | null>(null);

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin & settings</h1>
        <p className="text-sm text-muted-foreground">
          Connectors, routing, AI quality, unmatched identities, and digest preview.
        </p>
      </div>

      <Tabs defaultValue="connectors">
        <TabsList>
          <TabsTrigger value="connectors">Connectors</TabsTrigger>
          <TabsTrigger value="routing">PM routing</TabsTrigger>
          <TabsTrigger value="unmatched">Unmatched queue</TabsTrigger>
          <TabsTrigger value="eval">AI quality</TabsTrigger>
          <TabsTrigger value="digest">Weekly digest</TabsTrigger>
        </TabsList>

        <TabsContent value="connectors" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sourceConnections.map((c) => {
              const healthy = c.health === "Healthy";
              return (
                <Card key={c.source}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{c.source}</CardTitle>
                        <CardDescription className="text-xs">
                          {c.records.toLocaleString()} records · last sync {c.lastSync}
                        </CardDescription>
                      </div>
                      <Badge className={cn(
                        "border",
                        healthy
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900"
                          : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900",
                      )}>
                        {healthy ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                        {c.health}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sync enabled</span>
                      <Switch defaultChecked disabled={!can.manageConnectors} />
                    </div>
                    <div className="rounded-md border divide-y bg-muted/30">
                      <div className="grid grid-cols-2 px-3 py-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        <span>Source field</span>
                        <span>Maps to</span>
                      </div>
                      {fieldMappings[c.source].map((m, i) => (
                        <div key={i} className="grid grid-cols-2 px-3 py-2 text-xs font-mono">
                          <span className="text-muted-foreground">{m.from}</span>
                          <span>{m.to}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSyncDrawer(c.source)}>
                        <BarChart3 className="h-3.5 w-3.5 mr-1" /> Sync history
                      </Button>
                      <Button size="sm" variant="ghost" disabled={!can.manageConnectors}>
                        <RefreshCw className="h-3.5 w-3.5 mr-1" /> Resync now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="routing" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Route incoming feedback by product area to the responsible PM.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground border-y">
                  <tr className="text-left">
                    <th className="px-4 py-2 font-medium">Product area</th>
                    <th className="px-4 py-2 font-medium">Assigned PM</th>
                    <th className="px-4 py-2 font-medium">Auto-notify</th>
                    <th className="px-4 py-2 font-medium">Min urgency</th>
                    <th className="px-4 py-2 font-medium">SLA (first triage)</th>
                  </tr>
                </thead>
                <tbody>
                  {pmRouting.map((r) => (
                    <tr key={r.area} className="border-b last:border-0">
                      <td className="px-4 py-2.5 font-medium">{r.area}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">
                            {r.pm[0]}
                          </div>
                          {r.pm}
                        </div>
                      </td>
                      <td className="px-4 py-2.5"><Switch defaultChecked disabled={!can.manageConnectors} /></td>
                      <td className="px-4 py-2.5"><Input defaultValue="Medium" className="h-8 w-24 text-xs" disabled={!can.manageConnectors} /></td>
                      <td className="px-4 py-2.5"><Input defaultValue="24h" className="h-8 w-20 text-xs" disabled={!can.manageConnectors} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unmatched" className="mt-4">
          <UnmatchedTab />
        </TabsContent>

        <TabsContent value="eval" className="mt-4">
          <EvalTab />
        </TabsContent>

        <TabsContent value="digest" className="mt-4">
          <DigestTab />
        </TabsContent>
      </Tabs>

      <Sheet open={!!syncDrawer} onOpenChange={(o) => !o && setSyncDrawer(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {syncDrawer && <SyncHistory source={syncDrawer} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SyncHistory({ source }: { source: Source }) {
  const { data, isLoading } = useQuery({ queryKey: ["sync-runs", source], queryFn: () => adminClient.syncRuns(source) });
  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2"><SourceBadge source={source} /> Sync history</SheetTitle>
        <SheetDescription>Last sync runs for the {source} connector.</SheetDescription>
      </SheetHeader>
      <div className="mt-4 px-4 pb-6 space-y-2">
        {isLoading && [0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
        {data?.length === 0 && <p className="text-xs text-muted-foreground py-6 text-center">No runs recorded.</p>}
        {data?.map((r) => (
          <div key={r.id} className={cn(
            "rounded-md border p-3 text-xs",
            r.status === "Failed" && "border-rose-200 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/30",
            r.status === "Partial" && "border-amber-200 bg-amber-50/40 dark:border-amber-900 dark:bg-amber-950/30",
          )}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-muted-foreground">{r.startedAt.slice(0, 19).replace("T", " ")}</span>
              <Badge variant="outline" className="text-[10px]">{r.status}</Badge>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>{r.items} items ingested</span>
              <span className="text-muted-foreground">finished {r.finishedAt.slice(11, 19)}</span>
            </div>
            {r.error && <p className="mt-1 text-rose-700 dark:text-rose-300">{r.error}</p>}
          </div>
        ))}
      </div>
    </>
  );
}

function UnmatchedTab() {
  const { data, isLoading } = useQuery({ queryKey: ["unmatched"], queryFn: () => adminClient.unmatchedQueue() });
  const match = useMutation({
    mutationFn: ({ id, customerId }: { id: string; customerId: string }) => adminClient.matchUnmatched(id, customerId),
    onSuccess: () => toast.success("Identity matched — future items will route automatically."),
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2"><MailWarning className="h-4 w-4" /> Unmatched identity queue</CardTitle>
        <CardDescription className="text-xs">
          Feedback whose customer couldn't be resolved to a HubSpot company. Resolve manually so future items route correctly.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && <div className="p-4 space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>}
        <div className="divide-y">
          {data?.map((u) => (
            <div key={u.id} className="px-4 py-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <SourceBadge source={u.source} />
                    <span className="font-mono text-xs text-muted-foreground">{u.sourceRef}</span>
                  </div>
                  <p className="mt-1 truncate">{u.summary}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Raw: <span className="font-mono">{u.rawCustomerName}</span> · {u.rawEmail}
                  </p>
                </div>
                {u.suggestedMatches[0] ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={match.isPending}
                    onClick={() => match.mutate({ id: u.id, customerId: u.suggestedMatches[0].customerId })}
                  >
                    Match → {u.suggestedMatches[0].customerName}
                    <span className="ml-1.5 text-[10px] text-muted-foreground">{Math.round(u.suggestedMatches[0].confidence * 100)}%</span>
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" disabled>No suggestion</Button>
                )}
              </div>
            </div>
          ))}
          {data && data.length === 0 && <div className="px-4 py-8 text-center text-xs text-muted-foreground">Queue is empty.</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function EvalTab() {
  const { data, isLoading } = useQuery({ queryKey: ["eval"], queryFn: () => adminClient.evalScorecard() });
  const runEval = useMutation({
    mutationFn: () => adminClient.runEval(),
    onSuccess: (r) => toast.info(`Eval run enqueued · ETA ~${r.etaMinutes} min`),
  });
  if (isLoading || !data) return <Skeleton className="h-64 w-full" />;
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2"><GitBranch className="h-4 w-4" /> Bilingual AI quality scorecard</CardTitle>
            <CardDescription className="text-xs">
              Precision / recall / F1 against a labelled sample of real Jisr tickets. Gate the bilingual capability on these numbers.
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => runEval.mutate()} disabled={runEval.isPending}>
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1", runEval.isPending && "animate-spin")} /> Re-run eval
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Model: <span className="font-mono text-foreground">{data.modelVersion}</span></span>
          <span>Last run: <span className="text-foreground">{data.lastRun}</span></span>
          <span>AR samples: <span className="text-foreground">{data.arabicSamples}</span></span>
          <span>EN samples: <span className="text-foreground">{data.englishSamples}</span></span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground border-y">
            <tr className="text-left">
              <th className="px-4 py-2 font-medium">Tag</th>
              <th className="px-4 py-2 font-medium tabular-nums">Precision</th>
              <th className="px-4 py-2 font-medium tabular-nums">Recall</th>
              <th className="px-4 py-2 font-medium tabular-nums">F1</th>
              <th className="px-4 py-2 font-medium tabular-nums">AR F1</th>
              <th className="px-4 py-2 font-medium tabular-nums">EN F1</th>
            </tr>
          </thead>
          <tbody>
            {data.metrics.map((m) => (
              <tr key={m.tag} className="border-b last:border-0">
                <td className="px-4 py-2 font-medium">{m.tag}</td>
                <td className="px-4 py-2 tabular-nums">{(m.precision * 100).toFixed(0)}%</td>
                <td className="px-4 py-2 tabular-nums">{(m.recall * 100).toFixed(0)}%</td>
                <td className="px-4 py-2 tabular-nums font-semibold">{(m.f1 * 100).toFixed(0)}%</td>
                <td className={cn("px-4 py-2 tabular-nums", m.ar_f1 < 0.8 && "text-amber-700 dark:text-amber-300")}>{(m.ar_f1 * 100).toFixed(0)}%</td>
                <td className="px-4 py-2 tabular-nums">{(m.en_f1 * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function DigestTab() {
  const { data, isLoading } = useQuery({ queryKey: ["digest"], queryFn: () => adminClient.digestPreview() });
  const send = useMutation({
    mutationFn: () => adminClient.sendTestDigest(),
    onSuccess: (r) => toast.success(`Test digest sent to ${r.channel}`),
  });
  if (isLoading || !data) return <Skeleton className="h-64 w-full" />;
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Weekly Slack digest preview</CardTitle>
            <CardDescription className="text-xs">
              Auto-sent {data.scheduledFor} → {data.recipientChannel}
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => send.mutate()} disabled={send.isPending}>
            <Send className="h-3.5 w-3.5 mr-1" /> Send test
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border bg-muted/30 p-4 font-mono text-xs space-y-3 max-w-2xl">
          <div className="font-semibold text-sm">📊 JisrVOC Weekly Digest</div>
          <div>
            <div className="font-semibold text-foreground/80 mb-1">Top themes this week</div>
            {data.topThemes.map((t) => (
              <div key={t.themeId} className="flex justify-between">
                <span>• {t.name}</span>
                <span className="text-muted-foreground">{t.delta}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="font-semibold text-foreground/80 mb-1">New bets drafted</div>
            {data.newBets.map((b) => (
              <div key={b.betId}>• {b.title}</div>
            ))}
          </div>
          <div>🔥 <span className="font-semibold">{data.highUrgencyCount}</span> high-urgency items open — review in JisrVOC.</div>
        </div>
      </CardContent>
    </Card>
  );
}
