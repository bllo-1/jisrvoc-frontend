import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { betsClient } from "@/lib/api";
import {
  BetStatusBadge,
  TrendBadge,
  SegmentChip,
  UrgencyBadge,
} from "@/components/voc-badges";
import { Users, FileText, Flame } from "lucide-react";
import type { BetStatus, ProductBet } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/bets")({
  head: () => ({ meta: [{ title: "Product Bets · JisrVOC" }] }),
  component: BetsPage,
});

const COLUMNS: BetStatus[] = ["Draft", "In Backlog", "In Discovery", "In Build", "Shipped", "Declined"];

function BetsPage() {
  const qc = useQueryClient();
  const { can } = useAuth();
  const { data: bets, isLoading } = useQuery({ queryKey: ["bets"], queryFn: () => betsClient.list() });

  const [activeBet, setActiveBet] = useState<ProductBet | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BetStatus }) =>
      betsClient.changeStatus(id, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["bets"] });
      const prev = qc.getQueryData<ProductBet[]>(["bets"]);
      qc.setQueryData<ProductBet[]>(["bets"], (old) =>
        (old ?? []).map((b) => (b.id === id ? { ...b, status } : b)),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["bets"], ctx.prev);
      toast.error("Status change failed", { description: "Rolled back." });
    },
    onSuccess: (res) => {
      toast.success(`Status → ${res.newStatus}`, {
        description: `Wrote back to ${res.writebacksSucceeded}/${res.writebacksTriggered} source tickets${res.writebacksFailed ? ` · ${res.writebacksFailed} failed` : ""}.`,
      });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["bets"] }),
  });

  const handleDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id);
    setActiveBet((bets ?? []).find((b) => b.id === id) ?? null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveBet(null);
    const overId = e.over?.id;
    if (!overId) return;
    const betId = String(e.active.id);
    const newStatus = String(overId) as BetStatus;
    const bet = (bets ?? []).find((b) => b.id === betId);
    if (!bet || bet.status === newStatus) return;
    if (!can.editBetStatus) {
      toast.error("You can't move bets", { description: "PM or Admin role required." });
      return;
    }
    statusMut.mutate({ id: betId, status: newStatus });
  };

  return (
    <div className="p-6 space-y-4 max-w-[1700px]">
      <div className="flex items-end justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Product bets</h1>
          <p className="text-sm text-muted-foreground">
            Drag cards between columns to change status. Each move triggers write-back to source tickets.
          </p>
        </div>
        {!can.editBetStatus && (
          <span className="text-xs text-muted-foreground border rounded-md px-2 py-1">
            Read-only — switch to PM role in the header to drag bets.
          </span>
        )}
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {COLUMNS.map((col) => {
            const items = (bets ?? []).filter((b) => b.status === col);
            return (
              <KanbanColumn key={col} status={col} count={items.length}>
                {isLoading && [0, 1].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
                {items.map((b) => (
                  <DraggableBetCard key={b.id} bet={b} canDrag={can.editBetStatus} />
                ))}
                {!isLoading && items.length === 0 && (
                  <div className="text-center text-xs text-muted-foreground py-8">Drop here</div>
                )}
              </KanbanColumn>
            );
          })}
        </div>
        <DragOverlay>
          {activeBet ? (
            <div className="opacity-90 rotate-1">
              <BetCard bet={activeBet} dragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function KanbanColumn({ status, count, children }: { status: BetStatus; count: number; children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg bg-muted/40 border border-dashed flex flex-col min-h-[300px] transition-colors",
        isOver && "bg-primary/5 border-primary/40",
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-dashed">
        <BetStatusBadge status={status} />
        <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
      </div>
      <div className="p-2 space-y-2 flex-1">{children}</div>
    </div>
  );
}

function DraggableBetCard({ bet, canDrag }: { bet: ProductBet; canDrag: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: bet.id, disabled: !canDrag });
  return (
    <div
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.3 : 1 }}
      {...attributes}
      {...listeners}
    >
      <Link to="/bets/$betId" params={{ betId: bet.id }} className="block">
        <BetCard bet={bet} />
      </Link>
    </div>
  );
}

function BetCard({ bet, dragging }: { bet: ProductBet; dragging?: boolean }) {
  return (
    <Card className={cn("p-3 cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all", dragging && "shadow-lg border-primary/40")}>
      <h3 className="text-sm font-medium leading-snug line-clamp-2 mb-1">{bet.title}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{bet.problemStatement}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {bet.segments.map((s) => <SegmentChip key={s} segment={s} />)}
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{bet.customerCount}</span>
        <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" />{bet.evidenceIds.length}</span>
        <TrendBadge trend={bet.trend} />
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed">
        <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
          <Flame className="h-3 w-3" /> {bet.voteWeight} votes
        </span>
        <UrgencyBadge urgency={bet.urgency} />
      </div>
    </Card>
  );
}
