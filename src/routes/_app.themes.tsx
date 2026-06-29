import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { themesClient } from "@/lib/api";
import { getFeedbackForTheme } from "@/lib/mock-data";
import { TrendBadge, SegmentChip } from "@/components/voc-badges";
import { Users, MessageSquare, ThumbsUp, Search } from "lucide-react";

export const Route = createFileRoute("/_app/themes")({
  head: () => ({ meta: [{ title: "Themes · JisrVOC" }] }),
  component: ThemesPage,
});

function ThemesPage() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["themes", q],
    queryFn: () => themesClient.list({ q: q || undefined }),
  });
  const themes = data ?? [];

  return (
    <div className="p-6 space-y-6 max-w-[1600px]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Themes</h1>
          <p className="text-sm text-muted-foreground">
            AI-clustered patterns across all feedback. Click a theme to see verbatims and any
            associated product bet.
          </p>
        </div>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search themes..."
            className="pl-8 w-72"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading && [0,1,2,3,4,5].map(i => <Skeleton key={i} className="h-56 w-full" />)}
        {themes.map((t) => {
          const arVerbatim = getFeedbackForTheme(t.id).find((f) => f.language === "AR");
          return (
            <Link key={t.id} to="/themes/$themeId" params={{ themeId: t.id }} className="group">
              <Card className="h-full transition-colors hover:border-primary/40 hover:shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">
                      {t.name}
                    </CardTitle>
                    <TrendBadge trend={t.trend} />
                  </div>
                  <CardDescription className="text-xs leading-relaxed">
                    {t.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-md border bg-muted/30 p-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageSquare className="h-3 w-3" /> Items
                      </div>
                      <div className="text-base font-semibold mt-0.5 tabular-nums">{t.itemCount}</div>
                    </div>
                    <div className="rounded-md border bg-muted/30 p-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" /> Customers
                      </div>
                      <div className="text-base font-semibold mt-0.5 tabular-nums">{t.customerCount}</div>
                    </div>
                    <div className="rounded-md border bg-muted/30 p-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" /> Votes
                      </div>
                      <div className="text-base font-semibold mt-0.5 tabular-nums">{t.voteWeight}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">
                      Most affected:
                    </span>
                    {t.segments.map((s) => (
                      <SegmentChip key={s} segment={s} />
                    ))}
                  </div>
                  {arVerbatim && (
                    <div
                      dir="rtl"
                      className="text-xs text-muted-foreground border-r-2 border-primary/40 pr-3 line-clamp-2 italic"
                    >
                      "{arVerbatim.rawText}"
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
