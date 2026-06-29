import { Bell, Flame } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { getUrgencyAlerts } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";

export function HeaderAlerts() {
  const { user } = useAuth();
  if (!user) return null;
  const all = getUrgencyAlerts();
  // PMs only see items routed to them; Directors/Admins see all
  const alerts = user.role === "PM" ? all.filter((a) => a.routedTo === user.name.split(" ")[0]) : all;
  const count = alerts.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-semibold text-white">
              {count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Flame className="h-3.5 w-3.5 text-rose-500" />
            High-urgency alerts
          </div>
          <span className="text-[10px] text-muted-foreground">
            {user.role === "PM" ? `Routed to ${user.name}` : "All routing"}
          </span>
        </div>
        <div className="max-h-96 divide-y overflow-y-auto">
          {alerts.length === 0 && (
            <div className="px-3 py-8 text-center text-xs text-muted-foreground">
              Nothing urgent right now.
            </div>
          )}
          {alerts.map((a) => (
            <Link
              key={a.feedbackId}
              to="/feedback"
              className="block px-3 py-2.5 hover:bg-accent/50"
            >
              <div className="text-xs font-medium leading-tight line-clamp-2">{a.summary}</div>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{a.customer}</span>
                <span>·</span>
                <span>{a.area}</span>
                <span className="ml-auto">→ {a.routedTo}</span>
              </div>
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
