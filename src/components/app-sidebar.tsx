import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sparkles,
  MessageSquareText,
  Target,
  Building2,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth-context";

const items = [
  { title: "Overview", url: "/", icon: LayoutDashboard, exact: true, requires: null as null | "viewAdmin" },
  { title: "Themes", url: "/themes", icon: Sparkles, requires: null },
  { title: "Feedback Feed", url: "/feedback", icon: MessageSquareText, requires: null },
  { title: "Product Bets", url: "/bets", icon: Target, requires: null },
  { title: "Customers", url: "/customers", icon: Building2, requires: null },
  { title: "Admin", url: "/admin", icon: Settings, requires: "viewAdmin" as const },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { can, user } = useAuth();
  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const visible = items.filter((i) => !i.requires || can[i.requires]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm shrink-0">
            J
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold leading-tight">JisrVOC</span>
            <span className="text-[11px] text-muted-foreground leading-tight">
              Voice of Customer
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visible.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.exact)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="px-2 py-2 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          <div className="font-medium text-foreground">Signed in as {user?.name ?? "—"}</div>
          <div>{user?.role ?? "Guest"} · Prototype · v0.2</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
