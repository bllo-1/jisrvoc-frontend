import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { betsClient, type BetStatus } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BetStatusBadge,
  TrendBadge,
  UrgencyBadge,
  SourceBadge,
  CategoryBadge,
  LanguageBadge,
} from "@/components/voc-badges";
import { ArrowLeft, CheckCircle2, XCircle, Clock, Users, FileText, Flame } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/bets/$betId")({
  head: ({ params }) => ({ meta: [{ title: `Bet ${params.betId} · JisrVOC` }] }),
  component: BetDetailPage,
});

const STATUSES: BetStatus[] = ["Draft", "In Backlog", "In Discovery", "In Build", "Shipped", "Declined"];

function BetDetailPage() {
  const { betId } = Route.useParams();
  const navigate = useNavigate();
  const { can } = useAuth();
  const qc = useQueryClient();
  const [declinedReason, setDeclinedReason] = useState("");

  const betQ = useQuery({ queryKey: ["bet", betId], queryFn: () => betsClient.get(betId) });
  const evidenceQ = useQuery({ queryKey: ["bet", betId, "evidence"], queryFn: () => betsClient.evidence(betId) });
  const logQ = useQuery({ queryKey: ["bet", betId, "writeback"], queryFn: () => betsClient.writebackLog(betId) });

  const statusMut = useMutation({
    mutationFn: (s: BetStatus) => betsClient.changeStatus(betId, { status: s, declinedReason: s === "Declined" ? declinedReason : undefined }),
    onSuccess: (res) => {
      toast.success(`Status updated to "${res.newStatus}"`, {
        description: `Wrote back to ${res.writebacksSucceeded}/${res.writebacksTriggered} source tickets${res.writebacksFailed ? ` · ${res.writebacksFailed} failed` : ""}.`,
      });
      qc.invalidateQueries({ queryKey: ["bet", betId] });
      qc.invalidateQueries({ queryKey: ["bets"] });
    },
  });

  if (betQ.isLoading) return <BetDetailSkeleton />;
  const bet = betQ.data;
  if (!bet) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Bet not found.</p>
        <Link to="/bets" className="text-sm underline">Back to bets</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] space-y-5 p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/bets" })} className="-ml-2 h-8">
        <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to board
      </Button>

      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <BetStatusBadge status={bet.status} />
            <TrendBadge trend={bet.trend} />
            <UrgencyBadge urgency={bet.urgency} />
            <span className="text-xs text-muted-foreground">Owner: {bet.owner}</span>
          </div>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">{bet.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">Problem statement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed">
              <p className="text-foreground/90">{bet.problemStatement}</p>
              <div>
                <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Why now</div>
                <p className="text-foreground/80">{bet.problemDetail}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {bet.segments.map((s) => (
                  <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">
                Evidence ({bet.evidenceIds.length})
              </CardTitle>
              <CardDescription className="text-[10px]">
                Source tickets that will receive write-back on status change.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {evidenceQ.isLoading ? (
                <div className="p-3 space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : (
                <div className="divide-y">
                  {(evidenceQ.data ?? []).map((ev) => (
                    <div key={ev.id} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/40">
                      <SourceBadge source={ev.source} />
                      <span className="font-mono text-xs text-muted-foreground">{ev.sourceRef}</span>
                      <CategoryBadge category={ev.category} />
                      <LanguageBadge language={ev.language} />
                      <span className="flex-1 truncate">{ev.summary}</span>
                      <span className="whitespace-nowrap text-xs text-muted-foreground">{ev.customer}</span>
                    </div>
                  ))}
                  {!evidenceQ.data?.length && (
                    <div className="px-4 py-6 text-center text-xs text-muted-foreground">No evidence linked yet.</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">Write-back audit log</CardTitle>
              <CardDescription className="text-[10px]">
                Immutable record of every status push back to HubSpot, Zendesk, Canny, Jira.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {logQ.isLoading ? (
                <div className="p-3 space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-9 w-full" />)}</div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-muted/40 text-muted-foreground">
                    <tr className="text-left">
                      <th className="px-4 py-2 font-medium">When</th>
                      <th className="px-4 py-2 font-medium">By</th>
                      <th className="px-4 py-2 font-medium">Target</th>
                      <th className="px-4 py-2 font-medium">Status pushed</th>
                      <th className="px-4 py-2 font-medium">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(logQ.data ?? []).map((w) => (
                      <tr key={w.id} className="border-t">
                        <td className="px-4 py-2 tabular-nums text-muted-foreground">{w.performedAt.slice(0, 16).replace("T", " ")}</td>
                        <td className="px-4 py-2">{w.performedBy}</td>
                        <td className="px-4 py-2">
                          <span className="inline-flex items-center gap-1.5">
                            <SourceBadge source={w.source} />
                            <span className="font-mono text-muted-foreground">{w.sourceRef}</span>
                          </span>
                        </td>
                        <td className="px-4 py-2">{w.status}</td>
                        <td className="px-4 py-2">
                          <ResultPill result={w.result} message={w.errorMessage} />
                        </td>
                      </tr>
                    ))}
                    {!logQ.data?.length && (
                      <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No write-backs yet — change status above to trigger.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Metric icon={Users} label="Customers affected" value={bet.customerCount} />
              <Metric icon={Flame} label="Vote weight" value={bet.voteWeight} />
              <Metric icon={FileText} label="Evidence items" value={bet.evidenceIds.length} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wide text-muted-foreground">Change status</CardTitle>
              <CardDescription className="text-[10px]">
                {can.editBetStatus ? "Changes trigger write-back to source tickets." : "Read-only for your role."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={bet.status}
                disabled={!can.editBetStatus || statusMut.isPending}
                onValueChange={(v) => statusMut.mutate(v as BetStatus)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {bet.status === "Declined" && (
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Decline reason (visible in write-back)</label>
                  <Textarea
                    value={declinedReason}
                    onChange={(e) => setDeclinedReason(e.target.value)}
                    disabled={!can.editBetStatus}
                    rows={3}
                    placeholder="e.g. Covered by existing import + approval flow. Revisit Q3."
                  />
                </div>
              )}
              {statusMut.isPending && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3 w-3 animate-spin" /> Writing back…</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5" />{label}</span>
      <span className="text-lg font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function ResultPill({ result, message }: { result: "Success" | "Failed" | "Pending"; message?: string }) {
  const map = {
    Success: { Icon: CheckCircle2, cls: "text-emerald-700 dark:text-emerald-300" },
    Failed: { Icon: XCircle, cls: "text-rose-700 dark:text-rose-300" },
    Pending: { Icon: Clock, cls: "text-amber-700 dark:text-amber-300" },
  } as const;
  const { Icon, cls } = map[result];
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", cls)} title={message}>
      <Icon className="h-3 w-3" /> {result}
    </span>
  );
}

function BetDetailSkeleton() {
  return (
    <div className="max-w-[1400px] space-y-4 p-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-10 w-3/4" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="col-span-2 h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
