import { apiFetch } from "./client";
import type { ThemeListFilters, Theme, FeedbackItem, VoteTrendPoint, ThemeMergeResponse } from "./types";

export const themesClient = {
  /** @endpoint GET /api/v1/themes */
  list: (filters: ThemeListFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.productArea) params.set("product_area", filters.productArea);
    if (filters.segment) params.set("segment", filters.segment);
    if (filters.minVotes) params.set("min_votes", String(filters.minVotes));

    const query = params.toString();
    return apiFetch<Theme[]>(`/themes${query ? `?${query}` : ""}`);
  },

  /** @endpoint GET /api/v1/themes/:id */
  get: (id: string) => apiFetch<Theme>(`/themes/${id}`),

  /** @endpoint GET /api/v1/themes/:id/items */
  items: (id: string) => apiFetch<FeedbackItem[]>(`/themes/${id}/items`),

  /** @endpoint GET /api/v1/themes/:id/trend */
  trend: (id: string, weeks = 8) =>
    apiFetch<VoteTrendPoint[]>(`/themes/${id}/trend?weeks=${weeks}`),

  /** @endpoint POST /api/v1/themes/:id/merge */
  merge: (sourceId: string, targetId: string) =>
    apiFetch<ThemeMergeResponse>(`/themes/${targetId}/merge`, {
      method: "POST",
      body: JSON.stringify({ sourceId, targetId }),
    }),

  /** @endpoint PATCH /api/v1/themes/:id */
  rename: (id: string, name: string, description?: string) =>
    apiFetch<Theme>(`/themes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name, description }),
    }),
};
