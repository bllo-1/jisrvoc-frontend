import { apiFetch } from "./client";
import type { OverviewMetrics, Theme } from "./types";

export const overviewClient = {
  /** @endpoint GET /api/v1/overview/metrics */
  getMetrics: () =>
    apiFetch<OverviewMetrics>("/overview/metrics"),

  /** @endpoint GET /api/v1/overview/top-themes?limit=5 */
  getTopThemes: (limit = 5) =>
    apiFetch<Theme[]>(`/overview/top-themes?limit=${limit}`),
};
