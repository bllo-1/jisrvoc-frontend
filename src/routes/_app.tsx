import { Outlet, createFileRoute, Navigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { RoleSwitcher } from "@/components/role-switcher";
import { HeaderAlerts } from "@/components/header-alerts";
import { CommandPaletteTrigger } from "@/components/command-palette";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <AuthProvider>
      <AuthGate>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
            <SidebarInset className="flex-1 min-w-0">
              <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
                <SidebarTrigger />
                <div className="text-xs text-muted-foreground">JisrVOC · Internal prototype</div>
                <div className="ml-auto flex items-center gap-1">
                  <CommandPaletteTrigger />
                  <HeaderAlerts />
                  <RoleSwitcher />
                </div>
              </header>
              <main className="flex-1 min-w-0">
                <Outlet />
              </main>
            </SidebarInset>
          </div>
          <Toaster position="bottom-right" />
        </SidebarProvider>
      </AuthGate>
    </AuthProvider>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" />;
  return <>{children}</>;
}
