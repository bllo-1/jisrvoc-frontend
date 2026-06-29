---
name: implement-verify-iterate-loop-frontend
description: Autonomous implement-verify-iterate loops for JisrVoC frontend with build verification and visual testing until success
---

# Loop Engineering for JisrVoC Frontend

## Loop Pattern for Frontend

```
1. IMPLEMENT (Component/Route/Feature)
   ↓
2. VERIFY (Build + Visual Check)
   ↓
3. DECISION
   ├─ Success → DONE
   ├─ Build Error → FIX → ITERATE
   ├─ Visual Issue → REFINE → ITERATE
   └─ Blocked → ESCALATE
```

## Frontend-Specific Loops

### Loop 1: Component Implementation

**Goal**: Build component that renders correctly and passes TypeScript

```yaml
Loop: Theme Card Component
├─ Implement: Create component with Shadcn/ui
├─ Verify:
│   ├─ TypeScript: bun run typecheck
│   ├─ Build: bun run build
│   ├─ Visual: View in browser
├─ Iterate if: TS errors, build fails, styling broken
├─ Success: Builds + renders correctly + types valid
```

**Example**:
```
ITERATION 1:
- Implement ThemeCard component
- Verify: bun run typecheck
- Result: Type error - missing 'feedbackCount' prop

ITERATION 2:
- Add feedbackCount to interface
- Verify: bun run build
- Result: Success ✓

LOOP COMPLETE
```

### Loop 2: API Integration

**Goal**: Route fetches and displays real data from backend

```yaml
Loop: Theme List Page with Real Data
├─ Implement: Add TanStack Query to fetch themes
├─ Verify:
│   ├─ Build succeeds
│   ├─ Network tab shows API call
│   ├─ Data renders on page
├─ Iterate if: API errors, CORS issues, data not displayed
├─ Success: Page loads with real backend data
```

### Loop 3: Deployment

**Goal**: Frontend deploys successfully to Railway

```yaml
Loop: Deploy Frontend
├─ Implement: Push code to GitHub
├─ Verify:
│   ├─ Railway build status
│   ├─ Live URL returns HTML
│   ├─ Page renders correctly
├─ Iterate if: Build fails, 502 errors, broken UI
├─ Success: Live site working
```

## Verification Commands

```bash
# TypeScript check
bun run typecheck

# Build check
bun run build

# Local preview
bun run preview

# Check live deployment
curl https://jisrvoc-frontend-production.up.railway.app
```

## Quick Loop Example

```
You: "Use loop to add URL state for feedback filters"

Claude:
ITERATION 1:
- Added useSearch hook
- Verify: bun run typecheck
- Result: Type error in filter params

ITERATION 2:
- Fixed types with Zod schema
- Verify: bun run build
- Result: Build success ✓
- Visual check: Filters work ✓

LOOP COMPLETE
```

## Related Skills

- `component-development` - Component patterns for implementation
- `api-integration` - TanStack Query patterns for verification
- `railway-deployment` - Deployment verification steps
