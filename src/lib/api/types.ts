// Single source of truth for JisrVOC API request/response shapes.
// Backend team: generate Pydantic models from this file (or vice versa).

export type {
  Source,
  Category,
  ProductArea,
  Sentiment,
  Urgency,
  Language,
  Segment,
  Trend,
  BetStatus,
  FeedbackItem,
  Theme,
  ProductBet,
  Customer,
  WritebackEntry,
  SyncRun,
  EnrichmentMeta,
  UnmatchedItem,
  UrgencyAlert,
  Role,
  AppUser,
} from "@/lib/mock-data";

import type {
  Source,
  Category,
  ProductArea,
  Sentiment,
  Urgency,
  Language,
  Segment,
} from "@/lib/mock-data";

// ----- Feedback -----
export interface FeedbackListFilters {
  source?: Source;
  productArea?: ProductArea;
  category?: Category;
  sentiment?: Sentiment;
  urgency?: Urgency;
  language?: Language;
  segment?: Segment;
  q?: string;
  dateFrom?: string;
  dateTo?: string;
  cursor?: string;
  limit?: number;
}

export interface FeedbackTagEdit {
  category?: Category;
  productArea?: ProductArea;
  sentiment?: Sentiment;
  urgency?: Urgency;
  language?: Language;
  tags?: string[];
}

// ----- Bets -----
export interface BetStatusChangeRequest {
  status: import("@/lib/mock-data").BetStatus;
  declinedReason?: string;
}

export interface BetStatusChangeResponse {
  betId: string;
  newStatus: import("@/lib/mock-data").BetStatus;
  writebacksTriggered: number;
  writebacksSucceeded: number;
  writebacksFailed: number;
}

// ----- Themes -----
export interface ThemeListFilters {
  trend?: import("@/lib/mock-data").Trend;
  productArea?: ProductArea;
  q?: string;
}

// ----- Overview -----
export interface OverviewMetrics {
  totalFeedback: number;
  activeThemes: number;
  highUrgencyOpen: number;
  betsInFlight: number;
  weeklyVolume: { week: string; count: number }[];
  sourceBreakdown: { source: Source; count: number }[];
  productAreaBreakdown: { area: ProductArea; count: number }[];
  urgencyDistribution: { Low: number; Medium: number; High: number };
}

// ----- Admin -----
export interface FieldMapping {
  source: Source;
  mappings: { from: string; to: string }[];
}

export interface DigestPreview {
  scheduledFor: string;
  recipientChannel: string;
  topThemes: { themeId: string; name: string; delta: string }[];
  newBets: { betId: string; title: string }[];
  highUrgencyCount: number;
}
