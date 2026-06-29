---
name: tanstack-router-usage
description: Implement routing with TanStack Router including file-based routes, loaders, URL state management, and navigation patterns
---

# TanStack Router Patterns

## When to Use
Creating new routes, implementing navigation, managing URL state (filters, pagination), using loaders for SSR data fetching.

## File-Based Routing

```
app/routes/
├── __root.tsx              # Root layout (always rendered)
├── index.tsx               # / route
├── feedback.tsx            # /feedback route
├── themes.tsx              # /themes route
├── themes/
│   └── $themeId.tsx        # /themes/:themeId (dynamic param)
└── login.tsx               # /login route
```

## Creating Routes

### Basic Route
```typescript
// app/routes/themes.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ThemeGrid } from '~/components/ThemeGrid';

export const Route = createFileRoute('/themes')({
  component: ThemesPage,
});

function ThemesPage() {
  return (
    <div>
      <h1>Themes</h1>
      <ThemeGrid />
    </div>
  );
}
```

### Route with Loader (SSR Data Fetching)
```typescript
// app/routes/themes/$themeId.tsx
import { createFileRoute } from '@tanstack/react-router';
import { api } from '~/lib/api';

export const Route = createFileRoute('/themes/$themeId')({
  loader: async ({ params }) => {
    const theme = await api.get(`/themes/${params.themeId}`);
    const feedback = await api.get(`/feedback?theme=${params.themeId}`);
    return { theme, feedback };
  },
  component: ThemeDetailPage,
});

function ThemeDetailPage() {
  const { theme, feedback } = Route.useLoaderData();

  return (
    <div>
      <h1>{theme.name}</h1>
      <p>{theme.description}</p>
      <FeedbackList items={feedback} />
    </div>
  );
}
```

## Navigation

### Link Component
```typescript
import { Link } from '@tanstack/react-router';

<Link
  to="/themes/$themeId"
  params={{ themeId: theme.id }}
  className="text-primary hover:underline"
>
  View Theme
</Link>

// With search params
<Link
  to="/feedback"
  search={{ theme: themeId, page: 1 }}
>
  View Feedback
</Link>
```

### Programmatic Navigation
```typescript
import { useNavigate } from '@tanstack/react-router';

function ThemeCard({ theme }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: '/themes/$themeId',
      params: { themeId: theme.id },
    });
  };

  return <Card onClick={handleClick}>...</Card>;
}
```

## URL State Management

### Search Params (Filters, Pagination)
```typescript
// app/routes/feedback.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

// Define search params schema
const feedbackSearchSchema = z.object({
  theme: z.number().optional(),
  customer: z.number().optional(),
  page: z.number().default(1),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const Route = createFileRoute('/feedback')({
  validateSearch: feedbackSearchSchema,
  component: FeedbackPage,
});

function FeedbackPage() {
  const navigate = useNavigate({ from: '/feedback' });
  const search = Route.useSearch();

  const handleThemeChange = (themeId: number) => {
    navigate({
      search: (prev) => ({ ...prev, theme: themeId, page: 1 }),
    });
  };

  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({ ...prev, page }),
    });
  };

  return (
    <div>
      <Select value={search.theme} onValueChange={handleThemeChange}>
        {/* Theme options */}
      </Select>

      <FeedbackList theme={search.theme} page={search.page} />

      <Pagination currentPage={search.page} onPageChange={handlePageChange} />
    </div>
  );
}
```

### Preserving Search Params
```typescript
// Keep existing search params when navigating
<Link
  to="/themes/$themeId"
  params={{ themeId: theme.id }}
  search={(prev) => prev}  // Preserve current search
>
  View Theme
</Link>
```

## Root Layout

```typescript
// app/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '~/components/Header';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6">
        <Outlet />  {/* Child routes render here */}
      </main>
    </div>
  );
}
```

## Protected Routes (Phase 1)

```typescript
// app/routes/_authenticated.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '~/lib/auth';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: () => <Outlet />,
});

// Nested protected routes
// app/routes/_authenticated/bets.tsx
export const Route = createFileRoute('/_authenticated/bets')({
  component: BetsPage,
});
```

## Error Handling

```typescript
// app/routes/themes/$themeId.tsx
export const Route = createFileRoute('/themes/$themeId')({
  loader: async ({ params }) => {
    const theme = await api.get(`/themes/${params.themeId}`);
    if (!theme) {
      throw new Error('Theme not found');
    }
    return { theme };
  },
  errorComponent: ({ error }) => (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <Link to="/themes">Back to Themes</Link>
    </div>
  ),
  component: ThemeDetailPage,
});
```

## Pending State

```typescript
import { useRouterState } from '@tanstack/react-router';

function LoadingIndicator() {
  const router = useRouterState();

  if (!router.isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-primary animate-pulse" />
  );
}
```

## Breadcrumbs

```typescript
import { useMatches } from '@tanstack/react-router';

function Breadcrumbs() {
  const matches = useMatches();

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {matches.map((match, i) => (
        <span key={match.id}>
          <Link to={match.pathname}>{match.context.title}</Link>
          {i < matches.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}
```

## Related Skills
- `jisrvoc-frontend-context` - Route structure overview
- `api-integration` - Use loaders with TanStack Query
- `component-development` - Navigate from components
