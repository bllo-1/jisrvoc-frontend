import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/access-denied")({
  head: () => ({ meta: [{ title: "Access denied · JisrVOC" }] }),
  component: AccessDenied,
});

function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <ShieldAlert className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your role doesn't have permission to view this page. Switch role (top-right) or ask an admin for access.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to overview
          </Link>
        </div>
      </div>
    </div>
  );
}
