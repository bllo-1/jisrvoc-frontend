import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { customersClient } from "@/lib/api";
import {
  SourceBadge,
  CategoryBadge,
  SentimentBadge,
  UrgencyBadge,
  LanguageBadge,
  BetStatusBadge,
  TrendBadge,
  isRtl,
} from "@/components/voc-badges";
import { Search, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/customers")({
  head: () => ({ meta: [{ title: "Customers · JisrVOC" }] }),
  component: CustomersPage,
});

function CustomersPage() {
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const listQ = useQuery({ queryKey: ["customers", q], queryFn: () => customersClient.list(q || undefined) });
  const list = listQ.data ?? [];
  const activeId = selectedId ?? list[0]?.id ?? null;

  const selectedQ = useQuery({
    queryKey: ["customer", activeId],
    queryFn: () => (activeId ? customersClient.get(activeId) : Promise.resolve(null)),
    enabled: !!activeId,
  });
  const feedbackQ = useQuery({
    queryKey: ["customer", activeId, "feedback"],
    queryFn: () => (activeId ? customersClient.feedback(activeId) : Promise.resolve([])),
    enabled: !!activeId,
  });
  const betsQ = useQuery({
    queryKey: ["customer", activeId, "bets"],
    queryFn: () => (activeId ? customersClient.bets(activeId) : Promise.resolve([])),
    enabled: !!activeId,
  });

  const selected = selectedQ.data;
  const items = (feedbackQ.data ?? []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const linkedBets = betsQ.data ?? [];

  return (
    <div className="p-6 space-y-4 max-w-[1700px]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">
          A 360° view of feedback per company. Useful for CS and Sales before renewals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1 p-0 overflow-hidden h-fit">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search companies..."
                className="pl-8 h-9"
              />
            </div>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {listQ.isLoading && [0,1,2,3].map(i => <Skeleton key={i} className="h-12 m-2" />)}
            {list.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 border-b last:border-0 hover:bg-accent/40 transition-colors",
                  activeId === c.id && "bg-accent/60",
                )}
              >
                <div className="text-sm font-medium truncate">{c.name}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                  <span>{c.segment}</span>·<span>{c.industry}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {selected && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{selected.name}</CardTitle>
                        <CardDescription>
                          {selected.industry} · {selected.employees.toLocaleString()} employees
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{selected.segment}</Badge>
                      <Badge
                        className={cn(
                          "border",
                          selected.health === "Healthy" && "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900",
                          selected.health === "At Risk" && "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900",
                          selected.health === "Critical" && "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-900",
                        )}
                      >
                        {selected.health}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <Stat label="ARR" value={selected.arr} />
                    <Stat label="Feedback items" value={items.length} />
                    <Stat label="Linked bets" value={linkedBets.length} />
                    <Stat label="Renewal" value={selected.renewalDate} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Feedback timeline</CardTitle>
                    <CardDescription>All items from this customer across sources.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {feedbackQ.isLoading ? (
                      <div className="space-y-3">{[0,1,2].map(i => <Skeleton key={i} className="h-16" />)}</div>
                    ) : items.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">No feedback for this customer.</p>
                    ) : (
                      <ol className="relative border-l border-dashed pl-5 space-y-4">
                        {items.map((it) => (
                          <li key={it.id} className="relative">
                            <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                            <div className="flex items-center gap-2 mb-1 flex-wrap text-xs">
                              <span className="text-muted-foreground tabular-nums">{it.date}</span>
                              <SourceBadge source={it.source} />
                              <CategoryBadge category={it.category} />
                              <SentimentBadge sentiment={it.sentiment} />
                              <UrgencyBadge urgency={it.urgency} />
                              <LanguageBadge language={it.language} />
                            </div>
                            <p className="text-sm font-medium">{it.summary}</p>
                            <p
                              dir={isRtl(it.language) ? "rtl" : "ltr"}
                              className={cn(
                                "text-xs text-muted-foreground mt-1 leading-relaxed",
                                isRtl(it.language) && "font-arabic text-right",
                              )}
                            >
                              {it.rawText}
                            </p>
                          </li>
                        ))}
                      </ol>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Linked product bets</CardTitle>
                    <CardDescription>What we're doing about it.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {linkedBets.length === 0 && (
                      <p className="text-sm text-muted-foreground">No linked bets yet.</p>
                    )}
                    {linkedBets.map((b) => (
                      <div key={b.id} className="rounded-md border p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-medium leading-snug">{b.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{b.problemStatement}</p>
                        <div className="flex items-center justify-between gap-2">
                          <BetStatusBadge status={b.status} />
                          <TrendBadge trend={b.trend} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border bg-muted/30 p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
