# JisrVOC — Backend Handoff Document

> Companion to the frontend prototype. This document is the single source of truth a backend engineer (or Claude Code) needs to implement the JisrVOC backend so the existing React frontend works against it **with zero component changes**.

---

## 1. What exists today (frontend)

A complete React + TypeScript + TanStack Start prototype of the Voice-of-Customer intelligence dashboard for Jisr (HR/payroll SaaS).

- 6 views: Overview, Themes, Feedback Feed, Product Bets (kanban with drag/drop), Customers, Admin.
- Mock SSO login, RBAC (PM / Director / CS-Sales / Admin), URL-state filters, optimistic mutations, write-back audit toasts.
- Bilingual UI: English chrome, Arabic verbatims rendered RTL.
- All screens already talk to a typed API client at `src/lib/api/`. The client returns mocked data with a simulated delay. **The backend's job is to make those same function signatures hit real HTTP endpoints.**

### Key contract files (read these first)
| File | What it tells you |
|---|---|
| `src/lib/api/README.md` | API conventions, auth, pagination, error envelope |
| `src/lib/api/types.ts` | Every request/response shape (re-exports domain types from `mock-data.ts`) |
| `src/lib/api/overview.ts` | Endpoints + JSDoc `@endpoint` tags |
| `src/lib/api/feedback.ts` | "" |
| `src/lib/api/themes.ts` | "" |
| `src/lib/api/bets.ts` | "" |
| `src/lib/api/customers.ts` | "" |
| `src/lib/api/admin.ts` | "" |
| `src/lib/api/client.ts` | Base fetch wrapper (`apiFetch`), `ApiError`, `Paginated<T>` |
| `src/lib/mock-data.ts` | Domain types + sample data for fixtures/seeds |

Every API client function has a `@endpoint METHOD /api/v1/...` JSDoc tag. **Match those paths exactly** and the frontend swap is mechanical.

---

## 2. Recommended stack

Per the v1.2 architecture doc the team already aligned on:

- **Language/runtime:** Python 3.12, FastAPI, Uvicorn workers
- **DB:** PostgreSQL 15 + `pgvector` (themes embeddings)
- **Queue:** Redis + RQ or Celery (async enrichment, write-back)
- **Object store:** S3-compatible (raw payloads, attachments)
- **AI:** OpenAI / Anthropic via gateway; bilingual (AR/EN) prompts; versioned
- **Auth:** OIDC SSO (Google Workspace + Microsoft + SAML), JWT bearer
- **Hosting:** AWS Riyadh (me-south-1) or GCP Dammam — **Saudi data residency required (PDPL)**
- **Observability:** OpenTelemetry → Grafana/Loki/Tempo

Stay **modular monolith first**; only break out a service when scale demands it.

---

## 3. Core domain model (mirrors `mock-data.ts`)

```
Customer (1) ──< FeedbackItem (N) >── Theme (N) >── ProductBet (1)
                       │
                       └── EnrichmentMeta (model, version, confidence, pmCorrected)
                       └── SourceRef (HubSpot/Zendesk/Canny/Jira ticket id)

WritebackEntry: betId × feedbackId × sourceRef × status × result
SyncRun:        source × startedAt × itemsIngested × errors
UnmatchedItem:  rawCustomerString × suggestedCustomerId × confidence
AppUser:        id × email × role (PM/Director/CS-Sales/Admin) × pmAreas[]
```

All TypeScript types are in `src/lib/mock-data.ts` — copy them verbatim into Pydantic models. Same field names, same enums, same casing (camelCase on the wire).

---

## 4. Required endpoints (v1)

Source of truth = JSDoc `@endpoint` tags in `src/lib/api/*.ts`. Summary:

### Overview
- `GET /api/v1/overview/metrics`
- `GET /api/v1/overview/top-themes?limit=5`

### Feedback
- `GET /api/v1/feedback` — filters: `source, productArea, category, sentiment, urgency, language, segment, q, dateFrom, dateTo, cursor, limit`. Returns `{ items, nextCursor, total }`.
- `GET /api/v1/feedback/:id`
- `GET /api/v1/feedback/:id/enrichment`
- `PATCH /api/v1/feedback/:id/tags` — body: partial tag patch; sets `pmCorrected=true`
- `GET /api/v1/feedback/parent/:rawTicketRef` — siblings from same source ticket (decomposition)

### Themes
- `GET /api/v1/themes` — filters: `trend, productArea, q`
- `GET /api/v1/themes/:id`
- `GET /api/v1/themes/:id/items`
- `GET /api/v1/themes/:id/trend` — weekly vote series
- `POST /api/v1/themes/merge` — `{ sourceId, targetId }`
- `PATCH /api/v1/themes/:id` — `{ name?, description? }`

### Bets
- `GET /api/v1/bets`
- `GET /api/v1/bets/:id`
- `GET /api/v1/bets/:id/evidence`
- `GET /api/v1/bets/:id/writeback-log`
- `PATCH /api/v1/bets/:id/status` — `{ status, declinedReason? }` → **triggers async writeback to every linked source ticket**; returns `{ writebacksTriggered, writebacksSucceeded, writebacksFailed }`

### Customers
- `GET /api/v1/customers?q=`
- `GET /api/v1/customers/:id`
- `GET /api/v1/customers/:id/feedback`
- `GET /api/v1/customers/:id/bets`

### Admin
- `GET /api/v1/admin/connectors`
- `GET /api/v1/admin/connectors/:source/runs`
- `POST /api/v1/admin/connectors/:source/resync`
- `GET /api/v1/admin/sync-runs`
- `GET /api/v1/admin/pm-routing`
- `GET /api/v1/admin/unmatched-queue`
- `POST /api/v1/admin/unmatched-queue/:id/match` — `{ customerId }`
- `GET /api/v1/admin/eval-scorecard`
- `POST /api/v1/admin/eval-scorecard/run`
- `GET /api/v1/admin/digest/preview`
- `POST /api/v1/admin/digest/send-test`

### Webhooks (inbound from connectors)
- `POST /api/public/webhooks/hubspot`
- `POST /api/public/webhooks/zendesk`
- `POST /api/public/webhooks/canny`
- `POST /api/public/webhooks/jira`

All must HMAC-verify the signature before enqueuing the payload.

---

## 5. Conventions

- **Auth:** `Authorization: Bearer <jwt>` on every endpoint except `/healthz` and `/api/public/webhooks/*`. JWT claims: `sub`, `email`, `role`, `pm_areas[]`.
- **RBAC matrix** (mirrors `src/lib/auth-context.tsx`):
  | Capability | PM | Director | CS-Sales | Admin |
  |---|---|---|---|---|
  | editBetStatus | ✓ | | | ✓ |
  | editFeedbackTags | ✓ | | | ✓ |
  | viewAdmin | | ✓ | | ✓ |
  | manageConnectors | | | | ✓ |
  | triggerWriteback | ✓ | | | |
- **Pagination:** opaque cursor (`?cursor=&limit=`), response `{ items, nextCursor, total }`.
- **Errors:** `{ "error": { "code": "string", "message": "string", "details"?: any } }` + appropriate HTTP status.
- **Casing:** camelCase JSON on the wire (matches the TS types).
- **Dates:** ISO 8601 UTC strings.
- **Idempotency:** writebacks and webhooks must be idempotent (use `sourceRef + status` as the dedupe key).

---

## 6. Async pipelines

### 6.1 Ingestion
```
Webhook → verify HMAC → enqueue raw payload → worker:
  ├── normalize → FeedbackItem skeleton
  ├── customer match (exact → fuzzy → unmatched-queue)
  ├── language detect (AR/EN/Mixed)
  ├── PII redact (mask emails, phones, national IDs before LLM)
  ├── decompose multi-point tickets (LLM)
  ├── enrich tags (category, area, sentiment, urgency) — store model+version+confidence
  ├── theme assignment (embedding → pgvector cosine → threshold or new theme)
  └── persist
```

### 6.2 Write-back loop (closes the loop with CS)
On `PATCH /bets/:id/status`: enqueue one job per linked feedback item that posts a status note back to its source ticket (HubSpot note, Zendesk internal comment, Canny status update, Jira comment). Record every attempt in `writeback_log` with success/failure.

### 6.3 Scheduled jobs
- Weekly digest (Sunday 09:00 Riyadh) → Slack
- Daily eval scorecard refresh (AR/EN F1 per tag, sampled)
- Hourly connector health check

---

## 7. AI layer

- **Prompts versioned in git** (`prompts/<task>/<version>.txt`); store `prompt_version` on every enrichment row.
- **Bilingual prompts** — separate AR and EN system prompts; do not rely on single-prompt multilingual handling for sentiment/urgency.
- **PII redaction before inference** — non-negotiable for PDPL.
- **Eval harness:** golden set of 200 labeled AR + 200 EN items; per-tag F1 reported in `/admin/eval-scorecard`.
- **PM corrections** feed back into the golden set (mark `pmCorrected=true`, surface in next eval run).
- **Cost guardrails:** budget per source per day; circuit-break to "needs-manual-tag" on overrun.

---

## 8. Database schema sketch

Minimum tables (PG):
- `customers`, `app_users`, `roles`
- `source_connections`, `sync_runs`
- `feedback_items` (raw + normalized cols, `themes_id` FK nullable, `split_from_ref` nullable)
- `enrichments` (1:1 with feedback_items; model, version, confidence, pm_corrected, corrected_at, corrected_by)
- `themes` (+ `embedding vector(1536)`), `theme_merge_history`
- `product_bets`, `bet_evidence` (M:N feedback ↔ bets)
- `writeback_log`
- `unmatched_queue`
- `eval_runs`, `eval_metrics`
- `pm_routing` (product_area → pm_user_id, min_urgency)
- `audit_log` (every status change, tag edit, merge)

Indexes: `feedback_items(date DESC)`, `feedback_items(theme_id)`, `feedback_items(customer_id)`, `themes USING ivfflat (embedding vector_cosine_ops)`.

---

## 9. Security & compliance

- **PDPL (KSA Personal Data Protection Law):** data residency in Saudi Arabia; PII redaction logs; data subject deletion endpoint.
- **SAMA** applies if/when JisrPay data is ingested — keep that connector behind a feature flag until SAMA controls are reviewed.
- Secrets in AWS Secrets Manager / GCP Secret Manager — never in env files.
- Audit log for every mutating action.
- Rate limit: 100 req/min/user; 1000 req/min/connector webhook.

---

## 10. Phasing (de-risk the bilingual AI layer first)

**Phase 0 — Skeleton (1 week)**
FastAPI app, auth middleware, DB migrations, healthz, deploy pipeline, one stub endpoint (`GET /overview/metrics` returning fixtures from `mock-data.ts`).

**Phase 1a — Ingestion (2 weeks)**
HubSpot + Zendesk webhooks, normalize, persist, unmatched queue. No AI yet. Feedback Feed and Customers views go live against real data.

**Phase 1b — AI enrichment (3 weeks)**
Language detect, PII redact, tag enrichment, decomposition, eval harness. Themes view goes live (rule-based clustering first, embeddings second).

**Phase 2 — Bets + write-back (2 weeks)**
Bets CRUD, evidence linking, write-back workers for HubSpot/Zendesk. Bets view + audit log go live.

**Phase 3 — Canny/Jira + digest + admin polish (2 weeks)**
Remaining connectors, weekly digest, eval scorecard endpoints, PM routing.

Each phase ends with the corresponding frontend view fully live against real endpoints with **zero React changes**.

---

## 11. How to use this doc with Claude Code

1. Open the repo in Claude Code.
2. Point it at this file and `src/lib/api/`.
3. Prompt: *"Implement the JisrVOC backend per `BACKEND_HANDOFF.md`. Start with Phase 0 then Phase 1a. Generate Pydantic models from `src/lib/api/types.ts` and `src/lib/mock-data.ts`. Match every `@endpoint` JSDoc tag exactly."*
4. After each phase, flip the corresponding domain client in `src/lib/api/*.ts` from `mockDelay(...)` to `apiFetch(...)` — the wrapper is already in `src/lib/api/client.ts`.

---

## 12. Open questions for the team (resolve before Phase 1b)

- Embedding model: OpenAI `text-embedding-3-large` vs. self-hosted (cost vs. residency).
- LLM provider routing in KSA: Bedrock me-south-1 availability for chosen models.
- Slack workspace + channel for digest.
- SSO IdP final choice (Google Workspace assumed).
- Canny vs. Jira: are both in scope for v1, or Canny first?
