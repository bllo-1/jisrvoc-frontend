import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowUpRight, MessageSquareText, Sparkles, Flame, Target } from "lucide-react";
import { overviewClient } from "@/lib/api";
import { TrendBadge } from "@/components/voc-badges";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Overview · JisrVOC" }] }),
  component: Overview,
});

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function Kpi({
  label,
  value,
  delta,
  icon: Icon,
  tone,
  loading,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "warn" | "danger";
  loading?: boolean;
}) {
  const ring =
    tone === "danger"
      ? "ring-rose-200 dark:ring-rose-900"
      : tone === "warn"
      ? "ring-amber-200 dark:ring-amber-900"
      : "ring-border";
  return (
    <Card className={`ring-1 ${ring}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs">{label}</CardDescription>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-3xl font-semibold tracking-tight">{value}</div>
          )}
          {delta && !loading && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 inline-flex items-center">
              <ArrowUpRight className="h-3 w-3" />
              {delta}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Overview() {
  const metricsQ = useQuery({ queryKey: ["overview", "metrics"], queryFn: () => overviewClient.getMetrics() });
  const topQ = useQuery({ queryKey: ["overview", "top-themes"], queryFn: () => overviewClient.getTopThemes(5) });

  const m = metricsQ.data;
  const topThemes = topQ.data ?? [];
  const totalUrgency = m ? m.urgencyDistribution.Low + m.urgencyDistribution.Medium + m.urgencyDistribution.High : 0;

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          What customers are telling you across HubSpot, Zendesk, Canny and Jira.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Total feedback items" value={m?.totalFeedback.toLocaleString() ?? "—"} delta="+12% wow" icon={MessageSquareText} loading={metricsQ.isLoading} />
        <Kpi label="Active themes" value={m?.activeThemes ?? "—"} delta="+3 new" icon={Sparkles} loading={metricsQ.isLoading} />
        <Kpi label="High-urgency open" value={m?.highUrgencyOpen ?? "—"} icon={Flame} tone="danger" loading={metricsQ.isLoading} />
        <Kpi label="Bets in flight" value={m?.betsInFlight ?? "—"} icon={Target} tone="warn" loading={metricsQ.isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Feedback volume — last 12 weeks</CardTitle>
            <CardDescription>Items captured per week after decomposition.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {m ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={m.weeklyVolume} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <Skeleton className="h-full w-full" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">By source</CardTitle>
            <CardDescription>Where feedback originates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {m ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={m.sourceBreakdown} dataKey="count" nameKey="source" innerRadius={50} outerRadius={85} paddingAngle={2}>
                      {m.sourceBreakdown.map((_, i) => (
                        <Cell key={i} fill={chartColors[i % chartColors.length]} />
                      ))}
                    </Pie>
                    <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <Skeleton className="h-full w-full" />}
            </div>
            {m && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {m.sourceBreakdown.map((s, i) => (
                  <div key={s.source} className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: chartColors[i] }} />
                    <span className="text-muted-foreground">{s.source}</span>
                    <span className="ml-auto font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">By product area</CardTitle>
            <CardDescription>Where the noise concentrates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {m ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={m.productAreaBreakdown} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="area" width={100} tick={{ fontSize: 11, fill: "var(--foreground)" }} axisLine={false} tickLine={false} />
                    <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <Skeleton className="h-full w-full" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Urgency mix</CardTitle>
            <CardDescription>Distribution across all open items.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!m && [0,1,2].map(i => <Skeleton key={i} className="h-8 w-full" />)}
            {m && (["High", "Medium", "Low"] as const).map((u) => {
              const count = m.urgencyDistribution[u];
              const pct = (count / totalUrgency) * 100;
              const color =
                u === "High" ? "bg-rose-500" : u === "Medium" ? "bg-amber-500" : "bg-slate-400";
              return (
                <div key={u}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">{u}</span>
                    <span className="text-muted-foreground">
                      {count.toLocaleString()} · {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top themes this week</CardTitle>
          <CardDescription>The 5 themes with the most contributing items.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {topQ.isLoading && [0,1,2,3,4].map(i => <Skeleton key={i} className="h-12 my-2 w-full" />)}
            {topThemes.map((t, idx) => (
              <Link
                key={t.id}
                to="/themes/$themeId"
                params={{ themeId: t.id }}
                className="flex items-center gap-4 py-3 hover:bg-accent/40 -mx-2 px-2 rounded-md transition-colors"
              >
                <div className="text-xs text-muted-foreground tabular-nums w-5">{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.description}</div>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
                  <span><span className="font-medium text-foreground">{t.itemCount}</span> items</span>
                  <span><span className="font-medium text-foreground">{t.customerCount}</span> customers</span>
                </div>
                <TrendBadge trend={t.trend} />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
