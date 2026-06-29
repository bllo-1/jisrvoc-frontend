import { apiFetch, type Paginated } from "./client";
import type { FeedbackListFilters, FeedbackTagEdit, FeedbackItem, EnrichmentMeta } from "./types";

export const feedbackClient = {
  /** @endpoint GET /api/v1/feedback */
  list: (filters: FeedbackListFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.cursor) params.set("cursor", filters.cursor);
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.category) params.set("category", filters.category);
    if (filters.productArea) params.set("product_area", filters.productArea);
    if (filters.sentiment) params.set("sentiment", filters.sentiment);
    if (filters.urgency) params.set("urgency", filters.urgency);
    if (filters.source) params.set("source", filters.source);
    if (filters.segment) params.set("segment", filters.segment);
    if (filters.themeId) params.set("theme_id", filters.themeId);
    if (filters.customerId) params.set("customer_id", filters.customerId);

    const query = params.toString();
    return apiFetch<Paginated<FeedbackItem>>(`/feedback${query ? `?${query}` : ""}`);
  },

  /** @endpoint GET /api/v1/feedback/:id */
  get: (id: string) => apiFetch<FeedbackItem>(`/feedback/${id}`),

  /** @endpoint GET /api/v1/feedback/:id/enrichment */
  getEnrichment: (id: string) => apiFetch<EnrichmentMeta>(`/feedback/${id}/enrichment`),

  /** @endpoint PATCH /api/v1/feedback/:id/tags */
  updateTags: (id: string, patch: FeedbackTagEdit) =>
    apiFetch<FeedbackItem>(`/feedback/${id}/tags`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),

  /** @endpoint GET /api/v1/feedback/parent/:rawTicketRef — returns all decomposed cards from one source ticket */
  getSiblings: (rawTicketRef: string) =>
    apiFetch<FeedbackItem[]>(`/feedback/parent/${rawTicketRef}`),
};
