// Base fetch wrapper for the JisrVOC backend.
// Today: simulated delay around mock data. Tomorrow: real fetch.

const MOCK_DELAY_MS = [120, 340] as const;

export const apiBaseUrl =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined) ?? "/api/v1";

export async function mockDelay<T>(value: T): Promise<T> {
  const [lo, hi] = MOCK_DELAY_MS;
  const ms = lo + Math.floor(Math.random() * (hi - lo));
  await new Promise((r) => setTimeout(r, ms));
  return value;
}

// Real-fetch shape the backend will plug in once endpoints exist.
// Keep here so all domains pull from one place.
export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (init?.token) headers.set("Authorization", `Bearer ${init.token}`);

  const res = await fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body?.error?.message ?? res.statusText, body?.error?.code);
  }
  return (await res.json()) as T;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

export type Paginated<T> = {
  items: T[];
  nextCursor: string | null;
  total: number;
};
