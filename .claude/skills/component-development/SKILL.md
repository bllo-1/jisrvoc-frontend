---
name: react-component-patterns
description: Build React components for JisrVoC using Shadcn/ui, Tailwind CSS, TypeScript, and accessibility best practices
---

# Component Development Patterns

## When to Use
Creating new UI components, using Shadcn/ui, styling with Tailwind, implementing accessible interfaces.

## Component Structure

```typescript
// app/components/ThemeCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface ThemeCardProps {
  theme: {
    id: number;
    name: string;
    feedbackCount: number;
    trend?: 'up' | 'down' | 'stable';
  };
  onClick?: (id: number) => void;
}

export function ThemeCard({ theme, onClick }: ThemeCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick?.(theme.id)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {theme.name}
          {theme.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary">{theme.feedbackCount} items</Badge>
      </CardContent>
    </Card>
  );
}
```

## Using Shadcn/ui Components

### Add New Component
```bash
# Install a Shadcn component
npx shadcn@latest add button

# Or multiple at once
npx shadcn@latest add card dialog select input
```

### Common Components
- **Button**: `<Button variant="outline" size="sm">Click</Button>`
- **Card**: Container for content
- **Dialog**: Modal dialogs
- **Select**: Dropdowns
- **Input**: Form inputs
- **Badge**: Status indicators

## Tailwind Patterns

### Layout
```tsx
<div className="container mx-auto p-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map(item => <ItemCard key={item.id} item={item} />)}
  </div>
</div>
```

### Responsive Design
```tsx
<div className="text-sm md:text-base lg:text-lg">
  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
```

### Dark Mode Support
```tsx
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Secondary text</p>
</div>
```

## State Management in Components

### Local UI State
```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState<number | null>(null);
```

### Server State (TanStack Query)
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['themes'],
  queryFn: () => api.get('/themes'),
});

if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorMessage error={error} />;
```

## Accessibility

### Semantic HTML
```tsx
<button type="button" onClick={handleClick}>
  <span className="sr-only">Close dialog</span>
  <X className="h-4 w-4" />
</button>
```

### ARIA Labels
```tsx
<input
  aria-label="Search themes"
  aria-describedby="search-help"
  placeholder="Search..."
/>
<p id="search-help" className="text-sm text-muted-foreground">
  Type to filter themes
</p>
```

## Common Patterns

### Loading States
```typescript
export function FeedbackList() {
  const { data, isLoading } = useQuery({ queryKey: ['feedback'], queryFn: fetchFeedback });

  if (isLoading) {
    return <div className="space-y-4">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}
    </div>;
  }

  return <div>{data.map(item => <FeedbackCard key={item.id} item={item} />)}</div>;
}
```

### Error Boundaries
```typescript
export function ErrorFallback({ error }: { error: Error }) {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Something went wrong</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reload Page
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Form Handling
```typescript
export function ThemeNameDialog({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Theme name"
        required
      />
      <Button type="submit" disabled={!name.trim()}>
        Save
      </Button>
    </form>
  );
}
```

## Testing Components

```typescript
// tests/components/ThemeCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeCard } from '~/components/ThemeCard';

test('calls onClick when clicked', () => {
  const handleClick = vi.fn();
  const theme = { id: 1, name: 'Test Theme', feedbackCount: 10 };

  render(<ThemeCard theme={theme} onClick={handleClick} />);

  fireEvent.click(screen.getByText('Test Theme'));
  expect(handleClick).toHaveBeenCalledWith(1);
});
```

## Related Skills
- `jisrvoc-frontend-context` - Component structure overview
- `api-integration` - Fetch data for components
