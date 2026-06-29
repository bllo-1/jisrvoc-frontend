import { apiFetch } from "./client";
import type {
  BetStatusChangeRequest,
  BetStatusChangeResponse,
  ProductBet,
  FeedbackItem,
  WritebackEntry,
} from "./types";

export const betsClient = {
  /** @endpoint GET /api/v1/bets */
  list: () => apiFetch<ProductBet[]>("/bets"),

  /** @endpoint GET /api/v1/bets/:id */
  get: (id: string) => apiFetch<ProductBet>(`/bets/${id}`),

  /** @endpoint GET /api/v1/bets/:id/evidence */
  evidence: (id: string) => apiFetch<FeedbackItem[]>(`/bets/${id}/evidence`),

  /** @endpoint GET /api/v1/bets/:id/writeback-log */
  writebackLog: (id: string) => apiFetch<WritebackEntry[]>(`/bets/${id}/writeback-log`),

  /** @endpoint PATCH /api/v1/bets/:id/status */
  changeStatus: (id: string, body: BetStatusChangeRequest) =>
    apiFetch<BetStatusChangeResponse>(`/bets/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
