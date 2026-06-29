import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { feedbackClient } from "@/lib/api";
import {
  getEnrichment,
  type FeedbackItem,
  type Category,
  type ProductArea,
  type Sentiment,
  type Urgency,
} from "@/lib/mock-data";
import {
  SourceBadge,
  CategoryBadge,
  SentimentBadge,
  UrgencyBadge,
  LanguageBadge,
  isRtl,
} from "@/components/voc-badges";
import { useAuth } from "@/lib/auth-context";
import { Search, Split, Pencil, X, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ALL = "__all__";

const feedbackSearchSchema = z.object({
  source: fallback(z.enum(["HubSpot", "Zendesk", "Canny", "Jira"]).optional(), undefined),
  area: fallback(
    z.enum(["Core HR", "Payroll", "JisrPay", "Onboarding", "Offboarding", "Contracts", "Mobile", "Integrations", "Other"]).optional(),
    undefined,
  ),
  category: fallback(z.enum(["Pain Point", "Feature Request", "Bug Report", "How-To Question", "Praise"]).optional(), undefined),
  sentiment: fallback(z.enum(["Positive", "Neutral", "Negative", "Mixed"]).optional(), undefined),
  urgency: fallback(z.enum(["Low", "Medium", "High"]).optional(), undefined),
  language: fallback(z.enum(["AR", "EN", "Mixed"]).optional(), undefined),
  segment: fallback(z.enum(["SMB", "Mid-Market", "Enterprise", "Government"]).optional(), undefined),
  q: fallback(z.string(), "").default(""),
  cursor: fallback(z.string(), "0").default("0"),
  limit: fallback(z.coerce.number().int().min(10).max(100), 25).default(25),
});

export const Route = createFileRoute("/_app/feedback")({
  head: () => ({ meta: [{ title: "Feedback Feed · JisrVOC" }] }),
  validateSearch: zodValidator(feedbackSearchSchema),
  component: FeedbackPage,
});

function FeedbackPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/feedback" });
  const [open, setOpen] = useState<FeedbackItem | null>(null);

  type FeedSearch = typeof search;
  const setFilter = <K extends keyof FeedSearch>(key: K, value: FeedSearch[K] | undefined) => {
    navigate({
      search: (prev: FeedSearch) => ({
        ...prev,
        [key]: value,
        // Reset pagination cursor on any filter change
        cursor: "0",
      }),
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["feedback", search],
    queryFn: () =>
      feedbackClient.list({
        source: search.source,
        productArea: search.area,
        category: search.category,
        sentiment: search.sentiment,
        urgency: search.urgency,
        language: search.language,
        segment: search.segment,
        q: search.q || undefined,
        cursor: search.cursor,
        limit: search.limit,
      }),
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const start = Number(search.cursor || "0");
  const end = Math.min(start + search.limit, total);

  const hasFilters =
    !!(search.q || search.source || search.area || search.category || search.sentiment || search.urgency || search.language || search.segment);

  const clearAll = () =>
    navigate({
      search: {
        source: undefined,
        area: undefined,
        category: undefined,
        sentiment: undefined,
        urgency: undefined,
        language: undefined,
        segment: undefined,
        q: "",
        cursor: "0",
        limit: search.limit,
      },
    });

  return (
    <div className="p-6 space-y-4 max-w-[1700px]">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Feedback feed</h1>
        <p className="text-sm text-muted-foreground">
          {total.toLocaleString()} items after decomposition. Filters live in the URL — share or bookmark any view.
        </p>
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search.q}
              onChange={(e) => setFilter("q", e.target.value as never)}
              placeholder="Search summary, raw text, customer..."
              className="pl-8"
            />
          </div>
          <FilterSelect label="Source" value={search.source} onChange={(v) => setFilter("source", v as never)} options={["HubSpot", "Zendesk", "Canny", "Jira"]} />
          <FilterSelect label="Area" value={search.area} onChange={(v) => setFilter("area", v as never)} options={["Core HR", "Payroll", "JisrPay", "Onboarding", "Offboarding", "Contracts", "Mobile", "Integrations", "Other"]} />
          <FilterSelect label="Category" value={search.category} onChange={(v) => setFilter("category", v as never)} options={["Pain Point", "Feature Request", "Bug Report", "How-To Question", "Praise"]} />
          <FilterSelect label="Sentiment" value={search.sentiment} onChange={(v) => setFilter("sentiment", v as never)} options={["Positive", "Neutral", "Negative", "Mixed"]} />
          <FilterSelect label="Urgency" value={search.urgency} onChange={(v) => setFilter("urgency", v as never)} options={["Low", "Medium", "High"]} />
          <FilterSelect label="Lang" value={search.language} onChange={(v) => setFilter("language", v as never)} options={["AR", "EN", "Mixed"]} />
          <FilterSelect label="Segment" value={search.segment} onChange={(v) => setFilter("segment", v as never)} options={["SMB", "Mid-Market", "Enterprise", "Government"]} />
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <X className="h-3.5 w-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground border-b">
              <tr className="text-left">
                <th className="px-3 py-2 font-medium">Summary</th>
                <th className="px-3 py-2 font-medium">Source</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Area</th>
                <th className="px-3 py-2 font-medium">Sent.</th>
                <th className="px-3 py-2 font-medium">Urg.</th>
                <th className="px-3 py-2 font-medium">Lang</th>
                <th className="px-3 py-2 font-medium">Customer</th>
                <th className="px-3 py-2 font-medium">Segment</th>
                <th className="px-3 py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td colSpan={10} className="px-3 py-2"><Skeleton className="h-5 w-full" /></td>
                  </tr>
                ))}
              {!isLoading && items.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setOpen(row)}
                  className="border-b last:border-0 hover:bg-accent/40 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2 max-w-[420px]">
                    <div className="flex items-center gap-1.5">
                      {row.splitFrom && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground border rounded px-1 py-0.5" title={`Split from ${row.splitFrom}`}>
                          <Split className="h-2.5 w-2.5" /> {row.splitFrom}
                        </span>
                      )}
                      <span className="truncate">{row.summary}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2"><SourceBadge source={row.source} /></td>
                  <td className="px-3 py-2"><CategoryBadge category={row.category} /></td>
                  <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">{row.productArea}</td>
                  <td className="px-3 py-2"><SentimentBadge sentiment={row.sentiment} /></td>
                  <td className="px-3 py-2"><UrgencyBadge urgency={row.urgency} /></td>
                  <td className="px-3 py-2"><LanguageBadge language={row.language} /></td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap">{row.customer}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">{row.segment}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums whitespace-nowrap">{row.date}</td>
                </tr>
              ))}
              {!isLoading && items.length === 0 && (
                <tr><td colSpan={10} className="px-3 py-12 text-center text-sm text-muted-foreground">No feedback matches these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-3 border-t bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          <div>
            {total === 0 ? "—" : `${(start + 1).toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()}`}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              Per page:
              <Select
                value={String(search.limit)}
                onValueChange={(v) =>
                  navigate({ search: (prev: FeedSearch) => ({ ...prev, limit: Number(v), cursor: "0" }) })
                }
              >
                <SelectTrigger className="h-7 w-16 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-7"
              disabled={start === 0}
              onClick={() => {
                const prev = Math.max(0, start - search.limit);
                navigate({ search: (s: FeedSearch) => ({ ...s, cursor: String(prev) }) });
              }}
            >
              <ChevronLeft className="h-3 w-3" /> Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7"
              disabled={!data?.nextCursor}
              onClick={() => {
                if (data?.nextCursor)
                  navigate({ search: (s: FeedSearch) => ({ ...s, cursor: data.nextCursor! }) });
              }}
            >
              Next <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {open && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <SourceBadge source={open.source} />
                  <span className="text-xs text-muted-foreground">{open.sourceRef}</span>
                  <LanguageBadge language={open.language} />
                  {open.splitFrom && (
                    <Badge variant="outline" className="text-[10px] font-normal">
                      <Split className="h-3 w-3 mr-1" />
                      Split from {open.splitFrom}
                    </Badge>
                  )}
                </div>
                <SheetTitle className="text-base leading-snug pr-6">{open.summary}</SheetTitle>
                <SheetDescription>
                  {open.customer} · {open.segment} · {open.date}
                </SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 px-4 pb-6">
                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Raw original text
                  </div>
                  <div
                    dir={isRtl(open.language) ? "rtl" : "ltr"}
                    className={cn(
                      "rounded-md border bg-muted/30 p-3 text-sm leading-relaxed whitespace-pre-wrap",
                      isRtl(open.language) && "font-arabic text-right",
                    )}
                  >
                    {open.rawText}
                  </div>
                </div>

                <div className="space-y-3">
                  <FeedbackEnrichmentPanel item={open} />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FeedbackEnrichmentPanel({ item }: { item: FeedbackItem }) {
  const { can } = useAuth();
  const [current, setCurrent] = useState(item);
  const enrichment = getEnrichment(item.id);

  const patch = (changes: Partial<FeedbackItem>) => {
    setCurrent({ ...current, ...changes });
    toast.success("Tag updated", { description: "Marked as PM-corrected. Re-enrichment skipped on this item." });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          AI-generated tags
        </div>
        <div className="flex items-center gap-1.5">
          {enrichment.pmCorrected && (
            <Badge variant="outline" className="text-[10px] font-normal text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900">
              <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> PM corrected
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px] font-mono">
            conf {(enrichment.confidence * 100).toFixed(0)}%
          </Badge>
        </div>
      </div>

      <Field label="Category">
        <EditPopover disabled={!can.editFeedbackTags} value={current.category} options={["Pain Point", "Feature Request", "Bug Report", "How-To Question", "Praise"]} onChange={(v) => patch({ category: v as Category })}>
          <CategoryBadge category={current.category} />
        </EditPopover>
      </Field>
      <Field label="Product area">
        <EditPopover disabled={!can.editFeedbackTags} value={current.productArea} options={["Core HR", "Payroll", "JisrPay", "Onboarding", "Offboarding", "Contracts", "Mobile", "Integrations", "Other"]} onChange={(v) => patch({ productArea: v as ProductArea })}>
          <span className="text-sm">{current.productArea}</span>
        </EditPopover>
      </Field>
      <Field label="Sentiment">
        <EditPopover disabled={!can.editFeedbackTags} value={current.sentiment} options={["Positive", "Neutral", "Negative", "Mixed"]} onChange={(v) => patch({ sentiment: v as Sentiment })}>
          <SentimentBadge sentiment={current.sentiment} />
        </EditPopover>
      </Field>
      <Field label="Urgency">
        <EditPopover disabled={!can.editFeedbackTags} value={current.urgency} options={["Low", "Medium", "High"]} onChange={(v) => patch({ urgency: v as Urgency })}>
          <UrgencyBadge urgency={current.urgency} />
        </EditPopover>
      </Field>
      <Field label="Detected language"><LanguageBadge language={current.language} /></Field>
      <Field label="Tags">
        <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
          {current.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-[10px] font-normal">{t}</Badge>
          ))}
        </div>
      </Field>
      <div className="pt-2 text-[10px] text-muted-foreground">
        Enriched by <span className="font-mono">{enrichment.model}</span> · <span className="font-mono">{enrichment.modelVersion}</span>
        {enrichment.pmCorrected && enrichment.correctedBy && (
          <> · corrected by {enrichment.correctedBy} on {enrichment.correctedAt}</>
        )}
      </div>
    </>
  );
}

function EditPopover({
  value,
  options,
  onChange,
  disabled,
  children,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  if (disabled) return <>{children}</>;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 rounded hover:bg-accent/50 px-1 py-0.5 -mx-1 -my-0.5">
          {children}
          <Pencil className="h-2.5 w-2.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1">
        <div className="max-h-64 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={cn(
                "block w-full text-left px-2 py-1.5 text-xs rounded hover:bg-accent",
                opt === value && "bg-accent font-medium",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  options: string[];
}) {
  return (
    <Select value={value ?? ALL} onValueChange={(v) => onChange(v === ALL ? undefined : v)}>
      <SelectTrigger className="h-9 w-auto min-w-[120px] text-xs">
        <span className="text-muted-foreground mr-1">{label}:</span>
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o}>{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div>{children}</div>
    </div>
  );
}
