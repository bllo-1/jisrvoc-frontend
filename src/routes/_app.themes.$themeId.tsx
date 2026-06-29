import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ExternalLink, GitMerge, Pencil } from "lucide-react";
import { themesClient } from "@/lib/api";
import {
  themes,
  getBetById,
  type FeedbackItem,
} from "@/lib/mock-data";
import {
  TrendBadge,
  SegmentChip,
  SourceBadge,
  LanguageBadge,
  BetStatusBadge,
  isRtl,
} from "@/components/voc-badges";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/themes/$themeId")({
  head: () => ({ meta: [{ title: "Theme · JisrVOC" }] }),
  component: ThemeDetail,
  notFoundComponent: () => (
    <div className="p-6">
      <p className="text-sm">Theme not found.</p>
      <Link to="/themes" className="text-primary text-sm underline">Back to themes</Link>
    </div>
  ),
});

function ThemeDetail() {
  const { themeId } = Route.useParams();
  const qc = useQueryClient();
  const { can } = useAuth();

  const themeQ = useQuery({ queryKey: ["theme", themeId], queryFn: () => themesClient.get(themeId) });
  const itemsQ = useQuery({ queryKey: ["theme", themeId, "items"], queryFn: () => themesClient.items(themeId) });
  const trendQ = useQuery({ queryKey: ["theme", themeId, "trend"], queryFn: () => themesClient.trend(themeId) });

  const [renameOpen, setRenameOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [mergeTargetId, setMergeTargetId] = useState<string>("");

  const renameMut = useMutation({
    mutationFn: (name: string) => themesClient.rename(themeId, name),
    onSuccess: () => {
      toast.success("Theme renamed", { description: "Change propagated to top-themes digest." });
      qc.invalidateQueries({ queryKey: ["theme", themeId] });
      qc.invalidateQueries({ queryKey: ["themes"] });
      setRenameOpen(false);
    },
  });

  const mergeMut = useMutation({
    mutationFn: (targetId: string) => themesClient.merge(themeId, targetId),
    onSuccess: (res) => {
      toast.success("Themes merged", {
        description: `Items re-attached to "${themes.find((t) => t.id === res.mergedInto)?.name}". Audit log updated.`,
      });
      qc.invalidateQueries({ queryKey: ["themes"] });
      setMergeOpen(false);
    },
  });

  if (themeQ.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading theme…</div>;
  }
  const theme = themeQ.data;
  if (!theme) throw notFound();

  const items: FeedbackItem[] = itemsQ.data ?? [];
  const bet = theme.betId ? getBetById(theme.betId) : undefined;
  const trend = trendQ.data ?? [];

  const verbatims: FeedbackItem[] = (() => {
    const ar = items.filter((i) => i.language === "AR").slice(0, 2);
    const en = items.filter((i) => i.language === "EN").slice(0, 2);
    return [...ar, ...en].slice(0, 4);
  })();

  const segCounts = theme.segments.map((s) => ({
    segment: s,
    count: items.filter((i) => i.segment === s).length,
  }));

  const otherThemes = themes.filter((t) => t.id !== themeId);

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      <Link to="/themes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All themes
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {theme.productArea}
            </span>
            <TrendBadge trend={theme.trend} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{theme.name}</h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{theme.description}</p>
        </div>
        {can.editBetStatus && (
          <div className="flex items-center gap-2">
            <Dialog open={renameOpen} onOpenChange={(o) => { setRenameOpen(o); if (o) setNewName(theme.name); }}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Pencil className="h-3.5 w-3.5 mr-1.5" /> Rename</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename theme</DialogTitle>
                  <DialogDescription>Backend writes back to digest, alerts and any linked bets.</DialogDescription>
                </DialogHeader>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New theme name" />
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setRenameOpen(false)}>Cancel</Button>
                  <Button onClick={() => renameMut.mutate(newName)} disabled={!newName.trim() || renameMut.isPending}>
                    {renameMut.isPending ? "Saving…" : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={mergeOpen} onOpenChange={setMergeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><GitMerge className="h-3.5 w-3.5 mr-1.5" /> Merge into…</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Merge theme</DialogTitle>
                  <DialogDescription>
                    All {theme.itemCount} items will re-attach to the target theme. Original kept as alias for 30 days.
                  </DialogDescription>
                </DialogHeader>
                <Select value={mergeTargetId} onValueChange={setMergeTargetId}>
                  <SelectTrigger><SelectValue placeholder="Select target theme" /></SelectTrigger>
                  <SelectContent>
                    {otherThemes.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setMergeOpen(false)}>Cancel</Button>
                  <Button onClick={() => mergeMut.mutate(mergeTargetId)} disabled={!mergeTargetId || mergeMut.isPending}>
                    {mergeMut.isPending ? "Merging…" : "Merge"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Contributing items" value={theme.itemCount} />
        <StatCard label="Distinct customers" value={theme.customerCount} />
        <StatCard label="Combined vote weight" value={theme.voteWeight} />
        <StatCard label="Trend" value={theme.trend} />
      </div>

      {trend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mention volume</CardTitle>
            <CardDescription>Items and votes per week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <RTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="items" name="Items" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="votes" name="Votes" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Representative verbatims</CardTitle>
            <CardDescription>Mix of original-language quotes from customers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {verbatims.map((v) => (
              <div key={v.id} dir={isRtl(v.language) ? "rtl" : "ltr"} className="rounded-lg border bg-muted/30 p-4">
                <div className={`flex items-center gap-2 mb-2 ${isRtl(v.language) ? "flex-row-reverse" : ""}`}>
                  <SourceBadge source={v.source} />
                  <LanguageBadge language={v.language} />
                  <span className="text-xs text-muted-foreground">{v.customer}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{v.date}</span>
                </div>
                <p className={`text-sm leading-relaxed ${isRtl(v.language) ? "font-arabic text-right" : ""}`}>
                  {v.rawText}
                </p>
              </div>
            ))}
            {verbatims.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">No verbatims yet.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Segment breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {segCounts.map((s) => (
                <div key={s.segment} className="flex items-center justify-between text-sm">
                  <SegmentChip segment={s.segment} />
                  <span className="tabular-nums text-muted-foreground">{s.count} items</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {bet ? (
            <Card className="border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription>Associated product bet</CardDescription>
                  <BetStatusBadge status={bet.status} />
                </div>
                <CardTitle className="text-base leading-snug">{bet.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">{bet.problemStatement}</p>
                <Link to="/bets/$betId" params={{ betId: bet.id }} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  Open bet <ExternalLink className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardDescription>Associated product bet</CardDescription>
                <CardTitle className="text-base">No bet yet</CardTitle>
              </CardHeader>
              <CardContent>
                <Button size="sm" variant="outline">Draft a bet from this theme</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold tabular-nums mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}
