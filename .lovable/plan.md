
# Continue JisrVOC — finish deferred items

Picking up the 5 deferred items from the last turn so the frontend is fully handoff-ready.

## 1. URL-state filters + pagination on Feedback Feed
- Convert Feedback Feed filters (source, area, category, sentiment, urgency, language, segment, search, dateRange) from `useState` to TanStack Router `validateSearch` with `zodValidator`.
- Read with `Route.useSearch()`, update with `navigate({ search: prev => ... })`.
- Add cursor pagination UI (Prev/Next + page-size selector) wired to `?cursor=&limit=` so the same params map 1:1 to the future REST endpoint.
- `loaderDeps` only includes pagination keys so filter typing doesn't refetch.

## 2. Kanban drag-and-drop on Product Bets
- Add `@dnd-kit/core` + `@dnd-kit/sortable`.
- Make bet cards draggable between status columns; on drop call the same `updateBetStatus` API client used by the dropdown (RBAC-gated; non-PMs get a toast).
- Optimistic update with rollback on error; reuse the existing write-back toast.

## 3. Theme detail enhancements
- Sparkline (recharts `LineChart`) of weekly mention volume using `voteSeries` mock.
- "Merge into…" dialog (combobox of other themes) and "Rename" inline — both call new `mergeTheme` / `renameTheme` stubs in `src/lib/api/themes.ts` and show write-back toasts.
- Show merge history list at the bottom (mock entries).

## 4. Rewire Overview / Themes / Customers through the API client
- Replace direct `mock-data` imports in these three routes with `src/lib/api/*` calls via `useSuspenseQuery` + `ensureQueryData` in the route loader.
- Add `errorComponent` and `pendingComponent` (skeletons) on each.
- Keeps the mock-data module as the single source the API stubs read from — components stop touching it directly.

## 5. Auth shell upgrade
- Add a `/login` route with a mock SSO panel (Google / Microsoft / SAML buttons) that just sets the chosen `AppUser` into `AuthContext` and redirects.
- Wrap protected routes in a pathless `_app` layout with `beforeLoad` redirect to `/login` when no user. Today's role-switcher stays as a dev affordance behind a "Dev mode" toggle.
- Adds JWT-claim shape (`sub`, `email`, `role`, `pm_areas`) in `auth-context` so the real backend can drop in OIDC without component changes.

## Out of scope (call out for user)
- Real OIDC / SAML — only the shell.
- Realtime websocket for live feedback ingestion.
- i18n of the UI chrome itself (still English-only by design).

## Technical notes
- All new API methods stay in `src/lib/api/` with `@endpoint METHOD /api/v1/...` JSDoc tags so the backend team can scaffold FastAPI routes directly from the contract.
- No schema changes to `mock-data.ts` beyond adding `themeMergeHistory` and a couple of helper getters.
- After this pass, every screen reads through the API client, every mutation goes through a typed function, and every route has loading + error states. Backend team can implement against `src/lib/api/` 1:1.

Approve to proceed and I'll ship all five in one build pass.
