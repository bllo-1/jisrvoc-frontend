import { apiFetch } from "./client";
import type {
  DigestPreview,
  SourceConnection,
  SyncRun,
  PmRoutingRule,
  UnmatchedItem,
  EvalScorecard,
  ResyncResponse,
  EvalRunResponse,
  DigestSendResponse,
  Source,
} from "./types";

export const adminClient = {
  /** @endpoint GET /api/v1/admin/connectors */
  listConnectors: () => apiFetch<SourceConnection[]>("/admin/connectors"),

  /** @endpoint GET /api/v1/admin/connectors/:source/runs */
  syncRuns: (source: Source) => apiFetch<SyncRun[]>(`/admin/connectors/${source}/runs`),

  /** @endpoint POST /api/v1/admin/connectors/:source/resync */
  resync: (source: Source) =>
    apiFetch<ResyncResponse>(`/admin/connectors/${source}/resync`, {
      method: "POST",
    }),

  /** @endpoint GET /api/v1/admin/sync-runs */
  allSyncRuns: () => apiFetch<SyncRun[]>("/admin/sync-runs"),

  /** @endpoint GET /api/v1/admin/pm-routing */
  pmRouting: () => apiFetch<PmRoutingRule[]>("/admin/pm-routing"),

  /** @endpoint GET /api/v1/admin/unmatched-queue */
  unmatchedQueue: () => apiFetch<UnmatchedItem[]>("/admin/unmatched-queue"),

  /** @endpoint POST /api/v1/admin/unmatched-queue/:id/match */
  matchUnmatched: (id: string, customerId: string) =>
    apiFetch<{ id: string; customerId: string; resolved: boolean }>(
      `/admin/unmatched-queue/${id}/match`,
      {
        method: "POST",
        body: JSON.stringify({ customerId }),
      }
    ),

  /** @endpoint GET /api/v1/admin/eval-scorecard */
  evalScorecard: () => apiFetch<EvalScorecard>("/admin/eval-scorecard"),

  /** @endpoint POST /api/v1/admin/eval-scorecard/run */
  runEval: () =>
    apiFetch<EvalRunResponse>("/admin/eval-scorecard/run", {
      method: "POST",
    }),

  /** @endpoint GET /api/v1/admin/digest/preview */
  digestPreview: () => apiFetch<DigestPreview>("/admin/digest/preview"),

  /** @endpoint POST /api/v1/admin/digest/send-test */
  sendTestDigest: () =>
    apiFetch<DigestSendResponse>("/admin/digest/send-test", {
      method: "POST",
    }),
};
