---
name: railway-deploy-frontend
description: Deploy JisrVoC frontend to Railway with Nitro node-server preset, environment variables, and troubleshooting
---

# Railway Deployment for JisrVoC Frontend

## When to Use
Deploy frontend changes, update environment variables, troubleshoot deployment issues, rollback deployments.

## Current Setup
- **URL**: https://jisrvoc-frontend-production.up.railway.app
- **Repo**: https://github.com/bllo-1/jisrvoc-frontend
- **Branch**: master (auto-deploys on push)

## Quick Deploy Workflow

```bash
cd /Users/jisr4/Desktop/JisrVoC/jisrvoc-frontend

# 1. Build locally to test
bun run build
bun run preview  # Test production build

# 2. Commit and push
git add .
git commit -m "feat: add theme detail page

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin master

# 3. Monitor deployment
railway logs --follow

# 4. Verify
curl https://jisrvoc-frontend-production.up.railway.app
```

## Critical Configuration

### nitro.config.ts (REQUIRED)
```typescript
export default {
  preset: "node-server",  // Must be node-server, NOT cloudflare
};
```

### railway.json
```json
{
  "build": {"builder": "NIXPACKS"},
  "deploy": {
    "startCommand": "node .output/server/index.mjs",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Environment Variables
```bash
railway variables set VITE_API_BASE_URL="https://jisrvoc-backend-production.up.railway.app/api/v1"
```

## Common Issues

### Issue: 502 Bad Gateway
**Cause**: Wrong Nitro preset (cloudflare instead of node-server)
**Fix**: Ensure `nitro.config.ts` has `preset: "node-server"`

### Issue: API Calls Failing (CORS)
**Cause**: Incorrect API_BASE_URL or backend CORS not configured
**Fix**:
```bash
# Check frontend env var
railway variables | grep VITE_API_BASE_URL

# Test API directly
curl https://jisrvoc-backend-production.up.railway.app/api/v1/healthz
```

### Issue: Build Fails
**Cause**: TypeScript errors or missing dependencies
**Fix**:
```bash
# Build locally first
bun run build

# Check for TS errors
bun run typecheck
```

## Rollback

```bash
# Quick rollback to previous deployment
railway rollback

# Or revert git commit
git revert <commit-hash>
git push origin master
```

## Related Skills
- `jisrvoc-frontend-context` - Frontend architecture
- `api-integration` - Fix API connection issues
