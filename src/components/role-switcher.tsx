import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth, appUsers } from "@/lib/auth-context";
import { Check, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function RoleSwitcher() {
  const { user, switchUser, signOut } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 px-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {user.initials}
          </div>
          <div className="hidden text-left sm:block">
            <div className="text-xs font-medium leading-tight">{user.name}</div>
            <div className="text-[10px] leading-tight text-muted-foreground">{user.role}</div>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Demo: switch role to preview RBAC
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {appUsers.map((u) => (
          <DropdownMenuItem
            key={u.id}
            onSelect={() => switchUser(u.id)}
            className="flex items-center gap-2"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
              {u.initials}
            </div>
            <div className="flex-1">
              <div className="text-sm leading-tight">{u.name}</div>
              <div className="text-[10px] text-muted-foreground">{u.role}</div>
            </div>
            {u.id === user.id && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            signOut();
            navigate({ to: "/login" });
          }}
          className="text-muted-foreground"
        >
          <LogOut className="h-3.5 w-3.5 mr-2" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
