import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { appUsers, type AppUser, type Role } from "@/lib/mock-data";

interface AuthState {
  user: AppUser | null;
  isAuthed: boolean;
  signIn: (userId: string, provider?: string) => void;
  signOut: () => void;
  switchUser: (id: string) => void;
  // RBAC helpers — backend will mirror these as scopes on the JWT
  can: {
    editBetStatus: boolean;
    editFeedbackTags: boolean;
    viewAdmin: boolean;
    manageConnectors: boolean;
    triggerWriteback: boolean;
  };
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = "jisrvoc.auth.userId";

function computeCan(role: Role | undefined): AuthState["can"] {
  return {
    editBetStatus: role === "PM" || role === "Admin",
    editFeedbackTags: role === "PM" || role === "Admin",
    viewAdmin: role === "Admin" || role === "Director",
    manageConnectors: role === "Admin",
    triggerWriteback: role === "PM",
  };
}

function readStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start null on both server and client; hydrate from localStorage after mount
  // to avoid SSR/CSR mismatch.
  const [user, setUser] = useState<AppUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = readStoredUserId();
    if (id) {
      const u = appUsers.find((x) => x.id === id);
      if (u) setUser(u);
    }
    setHydrated(true);
  }, []);

  const persist = (u: AppUser | null) => {
    if (typeof window === "undefined") return;
    try {
      if (u) window.localStorage.setItem(STORAGE_KEY, u.id);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  };

  const signIn = (userId: string) => {
    const next = appUsers.find((u) => u.id === userId) ?? appUsers[0];
    setUser(next);
    persist(next);
  };
  const signOut = () => {
    setUser(null);
    persist(null);
  };
  const switchUser = (id: string) => {
    const next = appUsers.find((u) => u.id === id);
    if (next) {
      setUser(next);
      persist(next);
    }
  };

  // Until hydrated, treat as not-authed but don't redirect (handled by consumer).
  const value: AuthState = {
    user,
    isAuthed: !!user,
    signIn,
    signOut,
    switchUser,
    can: computeCan(user?.role),
  };

  return (
    <AuthContext.Provider value={value}>
      {hydrated ? children : <div className="min-h-screen" />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export { appUsers } from "@/lib/mock-data";
