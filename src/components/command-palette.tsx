import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { themes, bets, customers, feedback } from "@/lib/mock-data";

export function CommandPaletteTrigger() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate({ to: path });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-2 px-2 text-xs text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden md:inline">Search…</span>
        <kbd className="hidden md:inline-flex items-center rounded border bg-muted px-1 font-mono text-[10px]">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search themes, bets, customers, feedback…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Themes">
            {themes.slice(0, 6).map((t) => (
              <CommandItem key={t.id} value={t.name} onSelect={() => go(`/themes/${t.id}`)}>
                <span className="truncate">{t.name}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{t.itemCount} items</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Bets">
            {bets.slice(0, 6).map((b) => (
              <CommandItem key={b.id} value={b.title} onSelect={() => go(`/bets/${b.id}`)}>
                <span className="truncate">{b.title}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{b.status}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Customers">
            {customers.map((c) => (
              <CommandItem key={c.id} value={c.name} onSelect={() => go(`/customers`)}>
                <span className="truncate">{c.name}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{c.segment}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Recent feedback">
            {feedback.slice(0, 5).map((f) => (
              <CommandItem key={f.id} value={f.summary} onSelect={() => go(`/feedback`)}>
                <span className="truncate">{f.summary}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{f.source}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
