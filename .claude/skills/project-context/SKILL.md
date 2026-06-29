---
name: jisrvoc-frontend-context
description: JisrVoC frontend architecture using TanStack Start, Nitro SSR, React, Tailwind, and Shadcn/ui for Voice of Customer analytics dashboard
---

# JisrVoC Frontend Project Context

## Overview

**JisrVoC Frontend** is a modern, server-side rendered React application built with TanStack Start that provides an intuitive dashboard for exploring customer feedback themes, product bets, and customer insights.

**Current Status**: MVP deployed on Railway with SSR working, displays mock data from backend API.

## When to Use This Skill

**Always load first** when working on frontend tasks. Provides essential context about:
- TanStack Start architecture and file-based routing
- Component structure and patterns
- State management approach
- Deployment configuration

## Tech Stack

### Core Framework
- **TanStack Start**: React meta-framework with file-based routing
- **React 19**: UI library with latest features
- **TypeScript**: Type-safe development
- **Nitro**: SSR build tool (using `node-server` preset for Railway)

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Accessible component library
- **Lucide React**: Icon library
- **Recharts**: Chart library for data visualization

### State & Data
- **TanStack Query**: Server state management, data fetching, caching
- **TanStack Router**: File-based routing with loaders
- **URL State**: Filters and pagination managed in URL params

### Build & Deploy
- **Vite**: Build tool and dev server
- **Bun**: Package manager and runtime
- **Railway**: Deployment platform

## Architecture Pattern

### File-Based Routing

TanStack Start uses file system for routing:

```
app/
└── routes/
    ├── __root.tsx              # Root layout (always rendered)
    ├── index.tsx               # / (Overview page)
    ├── feedback.tsx            # /feedback (Feedback feed)
    ├── themes.tsx              # /themes (Theme explorer)
    ├── themes/
    │   └── $themeId.tsx        # /themes/:id (Theme detail)
    ├── customers.tsx           # /customers (Customer list)
    ├── customers/
    │   └── $customerId.tsx     # /customers/:id (Customer detail)
    ├── bets.tsx                # /bets (Product bets Kanban)
    └── login.tsx               # /login (Auth - Phase 1)
```

### Component Structure

```
app/
├── components/
│   ├── ui/                    # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── FeedbackCard.tsx       # Domain components
│   ├── ThemeCard.tsx
│   ├── CustomerCard.tsx
│   ├── BetCard.tsx
│   └── Header.tsx             # Layout components
├── lib/
│   ├── api.ts                 # API client (fetch wrapper)
│   ├── utils.ts               # Utility functions (cn, etc.)
│   └── auth.tsx               # Auth context (Phase 1)
└── styles/
    └── globals.css            # Global styles + Tailwind imports
```

## Current State

### Deployment
- **Platform**: Railway
- **URL**: https://jisrvoc-frontend-production.up.railway.app
- **Build**: Nitro `node-server` preset for SSR
- **Start**: `node .output/server/index.mjs`

### API Integration
```typescript
// app/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Production: https://jisrvoc-backend-production.up.railway.app/api/v1
```

### Data Fetching Pattern

Using TanStack Query for server state:

```typescript
// app/routes/themes.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '~/lib/api';

export default function ThemesPage() {
  const { data: themes, isLoading } = useQuery({
    queryKey: ['themes'],
    queryFn: () => api.get('/themes'),
  });

  if (isLoading) return <LoadingSpinner />;

  return <ThemeGrid themes={themes} />;
}
```

## Development Conventions

### 1. Component Patterns

**Functional Components with TypeScript**:
```typescript
// app/components/ThemeCard.tsx
import { Card } from '~/components/ui/card';

interface ThemeCardProps {
  theme: {
    id: number;
    name: string;
    description: string;
    feedbackCount: number;
  };
  onClick?: () => void;
}

export function ThemeCard({ theme, onClick }: ThemeCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition" onClick={onClick}>
      <h3 className="font-semibold">{theme.name}</h3>
      <p className="text-sm text-muted-foreground">{theme.description}</p>
      <span className="text-xs">{theme.feedbackCount} feedback items</span>
    </Card>
  );
}
```

### 2. Styling with Tailwind

**Use utility classes**:
```typescript
<div className="flex items-center gap-4 p-6 bg-background rounded-lg border">
  <Button variant="outline" size="sm">Action</Button>
</div>
```

**Custom classes in globals.css for reusable patterns**:
```css
/* app/styles/globals.css */
@layer components {
  .feedback-card {
    @apply rounded-lg border bg-card p-4 hover:shadow-md transition;
  }
}
```

### 3. State Management

**Server State**: TanStack Query
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['feedback', filters],
  queryFn: () => api.get('/feedback', { params: filters }),
});
```

**URL State**: TanStack Router search params
```typescript
import { useSearch } from '@tanstack/react-router';

const filters = useSearch({
  from: '/feedback',
  select: (search) => ({
    theme: search.theme,
    customer: search.customer,
    dateFrom: search.dateFrom,
  }),
});
```

**Local State**: useState for UI state
```typescript
const [isOpen, setIsOpen] = useState(false);
```

### 4. Routing Patterns

**Navigation**:
```typescript
import { Link } from '@tanstack/react-router';

<Link to="/themes/$themeId" params={{ themeId: theme.id }}>
  View Theme
</Link>
```

**Programmatic navigation**:
```typescript
import { useNavigate } from '@tanstack/react-router';

const navigate = useNavigate();
navigate({ to: '/themes/$themeId', params: { themeId: 123 } });
```

**Loaders for data fetching**:
```typescript
// app/routes/themes/$themeId.tsx
export const Route = createFileRoute('/themes/$themeId')({
  loader: async ({ params }) => {
    const theme = await api.get(`/themes/${params.themeId}`);
    return { theme };
  },
});
```

### 5. API Client Pattern

```typescript
// app/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class APIClient {
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    // Similar pattern...
  }
}

export const api = new APIClient();
```

## Railway Configuration

### Environment Variables

```bash
# .env.production
VITE_API_BASE_URL=https://jisrvoc-backend-production.up.railway.app/api/v1
```

### Nitro Configuration

```typescript
// nitro.config.ts
export default {
  preset: "node-server",  // IMPORTANT: Railway requires node-server, not cloudflare
};
```

### Railway Deployment

```json
// railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node .output/server/index.mjs",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Pages Overview

### 1. Overview (/) - Dashboard
- KPI cards (total feedback, themes, active bets)
- Recent feedback timeline
- Top themes chart
- Customer sentiment distribution

### 2. Feedback Feed (/feedback)
- Filterable list of all feedback
- Filters: theme, customer, date range, sentiment
- Pagination
- **Phase 1 TODO**: URL state for filters

### 3. Themes (/themes)
- Grid of theme cards
- Cluster visualization
- Sort by feedback count, recency
- **Phase 1 TODO**: Sparkline trends

### 4. Theme Detail (/themes/:id)
- Theme overview
- Related feedback list
- Trend chart
- **Phase 1 TODO**: Merge/rename actions

### 5. Product Bets (/bets)
- Kanban board (Proposed, In Progress, Shipped, Rejected)
- Bet cards with theme associations
- **Phase 1 TODO**: Drag-and-drop

### 6. Customers (/customers)
- Customer list with sentiment scores
- Filter by tier, NPS score
- Click to see customer detail

### 7. Customer Detail (/customers/:id)
- Customer profile
- Feedback history
- Sentiment trend
- Associated themes

## Frontend Polish Tasks (From .lovable/plan.md)

### 1. URL State Management
Add search params to Feedback Feed for filters and pagination:
```typescript
// Example implementation
const [searchParams, setSearchParams] = useSearchParams();

<Select
  value={searchParams.get('theme') || 'all'}
  onValueChange={(theme) => setSearchParams({ ...searchParams, theme })}
>
```

### 2. Drag-and-Drop Bets
Use @dnd-kit/core for Kanban functionality:
```bash
bun add @dnd-kit/core @dnd-kit/sortable
```

### 3. Theme Detail Enhancements
- Add sparkline charts (recharts)
- Merge/rename/delete actions
- Sample feedback quotes

### 4. API Rewiring
Update Overview, Themes, Customers to use real API instead of mock data.

### 5. Auth Shell
- Login route with form
- Auth context with JWT token storage
- Protected routes (redirect to /login)
- Logout button in header

## Design System

### Color Palette (Tailwind Config)
```javascript
// tailwind.config.js
colors: {
  border: "hsl(var(--border))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  // ... Shadcn/ui theme variables
}
```

### Typography
- Headings: `font-semibold` or `font-bold`
- Body: `text-sm` or `text-base`
- Muted: `text-muted-foreground`

### Spacing
- Container padding: `p-6` or `p-8`
- Gap between elements: `gap-4` or `gap-6`
- Card spacing: `space-y-4`

## Testing (Future)

```typescript
// tests/components/ThemeCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ThemeCard } from '~/components/ThemeCard';

test('renders theme card', () => {
  const theme = {
    id: 1,
    name: 'Authentication Issues',
    description: 'Login problems',
    feedbackCount: 42,
  };

  render(<ThemeCard theme={theme} />);

  expect(screen.getByText('Authentication Issues')).toBeInTheDocument();
  expect(screen.getByText('42 feedback items')).toBeInTheDocument();
});
```

## Performance Considerations

- **SSR**: Server-side rendering improves initial load
- **Code splitting**: Automatic with TanStack Start
- **Query caching**: TanStack Query caches API responses
- **Image optimization**: Use next/image equivalent when available

## Related Skills

- `railway-deployment` - Deploy frontend to Railway
- `component-development` - Build React components with Shadcn/ui
- `api-integration` - Integrate with backend API using TanStack Query
- `routing-and-navigation` - Use TanStack Router effectively

## Key Files

- `/.lovable/plan.md` - Frontend polish tasks
- `/nitro.config.ts` - Nitro SSR configuration
- `/railway.json` - Railway deployment config
- `/app/routes/__root.tsx` - Root layout
- `/app/lib/api.ts` - API client

## Success Criteria

You understand the frontend when you can:
- [ ] Explain TanStack Start file-based routing
- [ ] Create new routes with loaders
- [ ] Build components with Shadcn/ui + Tailwind
- [ ] Fetch data with TanStack Query
- [ ] Manage URL state with search params
- [ ] Deploy to Railway with Nitro node-server preset
