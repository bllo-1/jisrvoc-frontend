import { apiFetch } from "./client";
import type { Customer, FeedbackItem, ProductBet } from "./types";

export const customersClient = {
  /** @endpoint GET /api/v1/customers?q= */
  list: (q?: string) => {
    const query = q ? `?q=${encodeURIComponent(q)}` : "";
    return apiFetch<Customer[]>(`/customers${query}`);
  },

  /** @endpoint GET /api/v1/customers/:id */
  get: (id: string) => apiFetch<Customer>(`/customers/${id}`),

  /** @endpoint GET /api/v1/customers/:id/feedback */
  feedback: (id: string) => apiFetch<FeedbackItem[]>(`/customers/${id}/feedback`),

  /** @endpoint GET /api/v1/customers/:id/bets */
  bets: (id: string) => apiFetch<ProductBet[]>(`/customers/${id}/bets`),
};
