---
name: tanstack-query-patterns
description: Integrate backend APIs using TanStack Query with proper loading states, error handling, caching, and optimistic updates
---

# API Integration with TanStack Query

## When to Use
Fetching data from backend, managing server state, implementing mutations, caching strategies, optimistic updates.

## API Client Setup

```typescript
// app/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class APIClient {
  private baseURL = API_BASE_URL;

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(await this.getAuthHeaders()),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new APIError(response.status, await response.text());
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request('POST', endpoint, data);
  }

  private async getAuthHeaders() {
    // Phase 1: Add JWT token
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const api = new APIClient();

export class APIError extends Error {
  constructor(public status: number, public body: string) {
    super(`API Error ${status}: ${body}`);
  }
}
```

## Query Patterns

### Basic Query
```typescript
// app/routes/themes.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '~/lib/api';

export default function ThemesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['themes'],
    queryFn: () => api.get('/themes'),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <ThemeGrid themes={data} />;
}
```

### Query with Parameters
```typescript
const { data: feedback } = useQuery({
  queryKey: ['feedback', themeId, dateRange],
  queryFn: () => api.get(`/feedback?theme=${themeId}&from=${dateRange.from}`),
  enabled: !!themeId,  // Only run if themeId exists
});
```

### Dependent Queries
```typescript
const { data: theme } = useQuery({
  queryKey: ['theme', themeId],
  queryFn: () => api.get(`/themes/${themeId}`),
});

const { data: feedback } = useQuery({
  queryKey: ['feedback', theme?.id],
  queryFn: () => api.get(`/feedback?theme=${theme.id}`),
  enabled: !!theme,  // Wait for theme to load
});
```

## Mutation Patterns

### Basic Mutation
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function UpdateThemeDialog({ theme }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { name: string }) =>
      api.post(`/themes/${theme.id}`, data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      queryClient.invalidateQueries({ queryKey: ['theme', theme.id] });
    },
  });

  const handleSubmit = (name: string) => {
    mutation.mutate({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input name="name" defaultValue={theme.name} />
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save'}
      </Button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </form>
  );
}
```

### Optimistic Updates
```typescript
const mutation = useMutation({
  mutationFn: (newTheme) => api.post('/themes', newTheme),
  onMutate: async (newTheme) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['themes'] });

    // Snapshot previous value
    const previousThemes = queryClient.getQueryData(['themes']);

    // Optimistically update
    queryClient.setQueryData(['themes'], (old) => [...old, newTheme]);

    return { previousThemes };
  },
  onError: (err, newTheme, context) => {
    // Rollback on error
    queryClient.setQueryData(['themes'], context.previousThemes);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries({ queryKey: ['themes'] });
  },
});
```

## Pagination

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

function FeedbackFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['feedback'],
    queryFn: ({ pageParam = 0 }) =>
      api.get(`/feedback?skip=${pageParam}&limit=20`),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length * 20 : undefined,
    initialPageParam: 0,
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.map(item => <FeedbackCard key={item.id} item={item} />)}
        </div>
      ))}
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
}
```

## Caching Strategies

### Stale-While-Revalidate
```typescript
const { data } = useQuery({
  queryKey: ['themes'],
  queryFn: fetchThemes,
  staleTime: 5 * 60 * 1000,  // Consider fresh for 5 minutes
  gcTime: 10 * 60 * 1000,    // Keep in cache for 10 minutes
});
```

### Manual Cache Updates
```typescript
const queryClient = useQueryClient();

// Update specific item
queryClient.setQueryData(['theme', themeId], (old) => ({
  ...old,
  name: newName,
}));

// Invalidate multiple queries
queryClient.invalidateQueries({ queryKey: ['themes'] });
queryClient.invalidateQueries({ queryKey: ['feedback'] });
```

## Error Handling

### Per-Query Error Handling
```typescript
const { data, error, isError } = useQuery({
  queryKey: ['themes'],
  queryFn: fetchThemes,
  retry: 3,  // Retry 3 times
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (isError) {
  if (error instanceof APIError && error.status === 404) {
    return <NotFound />;
  }
  return <ErrorMessage error={error} />;
}
```

### Global Error Handling
```typescript
// app/root.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Query error:', error);
        // Show toast notification
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
        // Show error toast
      },
    },
  },
});

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
```

## Loading States

### Skeleton Loading
```typescript
import { Skeleton } from '~/components/ui/skeleton';

function ThemeList() {
  const { data, isLoading } = useQuery({ queryKey: ['themes'], queryFn: fetchThemes });

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return <ThemeGrid themes={data} />;
}
```

## Devtools

```typescript
// app/root.tsx (development only)
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

## Related Skills
- `jisrvoc-frontend-context` - API client location
- `component-development` - Use queries in components
- `routing-and-navigation` - Use loaders for SSR data fetching
