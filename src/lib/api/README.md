# JisrVOC API contract

This folder is the **single source of truth** for the JisrVOC backend HTTP
contract. The frontend imports everything through this layer; today it
returns mock data, tomorrow the backend swaps the implementation for real
`fetch('/api/v1/...')` calls and **no component code changes**.

## For the backend team

- All request/response types are exported from `./types.ts`. Treat them
  as the spec: every endpoint must accept/return these exact shapes (or a
  superset, never a different shape).
- Endpoint paths are documented inline in each domain file as JSDoc
  `@endpoint` tags — match them when you implement.
- All list endpoints are cursor-paginated (`{ items, nextCursor }`).
- Errors should follow `{ error: { code, message, details? } }` with HTTP
  status reflecting the failure (4xx client, 5xx server).
- Auth: every endpoint except `/healthz` and `/webhooks/*` requires a
  valid bearer JWT (issued by the SSO/OIDC flow). The frontend sends it
  as `Authorization: Bearer <token>`.

## Domains
- `overview.ts` — homepage KPIs, trend charts, top themes
- `feedback.ts` — feed listing, single item, tag edits, parent ticket
- `themes.ts` — list, detail, verbatims, vote series, merge
- `bets.ts` — list, detail, status change, evidence, writeback log
- `customers.ts` — list, detail, feedback timeline, linked bets
- `admin.ts` — connectors, sync runs, field mappings, PM routing, unmatched
  queue, eval scorecard, digest preview

## Swapping mock → real

Each domain file exports a `client` object. In production, replace the
implementations with `fetch` calls; the function signatures stay
identical so React Query keys and component code do not change. See
`./client.ts` for the planned base wrapper.
