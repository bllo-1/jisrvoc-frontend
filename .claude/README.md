# Claude Skills for JisrVoC Frontend

Claude Code skills for developing the JisrVoC frontend with TanStack Start, React, Tailwind, and Shadcn/ui.

## Available Skills

### 🏗️ Foundation

#### `project-context`
**Load first.** Complete overview of TanStack Start architecture, routing system, component structure, tech stack, and conventions.

**Use when**: Starting frontend work, understanding architecture, onboarding.

### 🎨 Development

#### `component-development`
Build React components using Shadcn/ui, Tailwind CSS, TypeScript, with accessibility and testing patterns.

**Use when**: Creating UI components, using Shadcn/ui, styling with Tailwind.

#### `api-integration`
Integrate backend APIs with TanStack Query including queries, mutations, caching, optimistic updates, and error handling.

**Use when**: Fetching data, managing server state, implementing mutations.

#### `routing-and-navigation`
Implement file-based routing with TanStack Router including loaders, URL state, navigation, and protected routes.

**Use when**: Creating routes, managing URL state, implementing navigation.

### 🚀 Deployment

#### `railway-deployment`
Deploy frontend to Railway with Nitro configuration, environment variables, and troubleshooting.

**Use when**: Deploying changes, fixing deployment issues, configuring Railway.

## Quick Start

```
You: "I need to create a new theme detail page"
Claude: [Loads routing-and-navigation + component-development skills]
→ Creates route file with loader
→ Builds components following patterns
→ Implements navigation
```

## Skill Structure

```
skills/
└── skill-name/
    └── SKILL.md    # Instructions with YAML frontmatter
```

Each skill has metadata for automatic discovery:
```yaml
---
name: skill-id
description: When Claude should use this skill
---
```

## Development Workflow

### Creating a New Page
```
1. Load routing-and-navigation skill
2. Create route file in app/routes/
3. Load component-development skill
4. Build page components
5. Load api-integration skill
6. Fetch data with TanStack Query
```

### Deploying Changes
```
1. Build locally: bun run build
2. Test: bun run preview
3. Commit and push
4. Load railway-deployment skill
5. Monitor deployment
6. Verify live site
```

## Progressive Disclosure

**Token Efficiency**: 5 frontend skills = ~500 tokens metadata, 15,000+ tokens of guidance available on-demand.

Skills only load when needed, preserving context for actual development work.

## Frontend Polish Tasks

From `.lovable/plan.md`:
1. URL state for filters/pagination
2. Drag-and-drop bets (Kanban)
3. Theme detail enhancements
4. API rewiring (remove mock data)
5. Auth shell (login, protected routes)

Each task has corresponding skills to guide implementation.

## Related Files

- `/.lovable/plan.md` - Frontend polish roadmap
- `/nitro.config.ts` - Nitro configuration (node-server preset)
- `/railway.json` - Railway deployment config
- `/.env.production` - Production environment variables

## Customization

Edit skill files to add:
- Project-specific patterns
- Team conventions
- Troubleshooting guides
- New framework features

---

**Status**: 5 skills covering routing, components, API integration, and deployment.
