import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type {
  Source,
  Sentiment,
  Urgency,
  Category,
  Trend,
  BetStatus,
  Segment,
  Language,
} from "@/lib/mock-data";

export function SourceBadge({ source }: { source: Source }) {
  const map: Record<Source, string> = {
    HubSpot: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-900",
    Zendesk: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900",
    Canny: "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-900",
    Jira: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-900",
  };
  return <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium", map[source])}>{source}</span>;
}

export function CategoryBadge({ category }: { category: Category }) {
  const map: Record<Category, string> = {
    "Pain Point": "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-900",
    "Feature Request": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900",
    "Bug Report": "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-900",
    "How-To Question": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900",
    "Praise": "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-900",
  };
  return <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium", map[category])}>{category}</span>;
}

export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const map: Record<Sentiment, string> = {
    Positive: "text-emerald-700 dark:text-emerald-300",
    Neutral: "text-muted-foreground",
    Negative: "text-rose-700 dark:text-rose-300",
    Mixed: "text-amber-700 dark:text-amber-300",
  };
  const dot: Record<Sentiment, string> = {
    Positive: "bg-emerald-500",
    Neutral: "bg-slate-400",
    Negative: "bg-rose-500",
    Mixed: "bg-amber-500",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", map[sentiment])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot[sentiment])} />
      {sentiment}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const map: Record<Urgency, string> = {
    Low: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    Medium: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900",
    High: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-900",
  };
  return <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium", map[urgency])}>{urgency}</span>;
}

export function LanguageBadge({ language }: { language: Language }) {
  return (
    <span className="inline-flex items-center rounded border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
      {language}
    </span>
  );
}

export function TrendBadge({ trend }: { trend: Trend }) {
  const map: Record<Trend, string> = {
    New: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900",
    Rising: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-900",
    Stable: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    Declining: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900",
  };
  const arrow: Record<Trend, string> = { New: "✦", Rising: "↑", Stable: "→", Declining: "↓" };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium", map[trend])}>
      <span>{arrow[trend]}</span> {trend}
    </span>
  );
}

export function BetStatusBadge({ status }: { status: BetStatus }) {
  const map: Record<BetStatus, string> = {
    Draft: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    "In Backlog": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900",
    "In Discovery": "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950 dark:text-violet-200 dark:border-violet-900",
    "In Build": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900",
    Shipped: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900",
    Declined: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-900",
  };
  return <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", map[status])}>{status}</span>;
}

export function SegmentChip({ segment }: { segment: Segment }) {
  return (
    <Badge variant="outline" className="font-normal text-[10px] py-0">
      {segment}
    </Badge>
  );
}

export function isRtl(language: Language) {
  return language === "AR";
}
