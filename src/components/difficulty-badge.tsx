import { cn } from "@/lib/utils";

export function DifficultyBadge({ d, className }: { d: string; className?: string }) {
  const map: Record<string, string> = {
    Easy: "bg-success/15 text-success border-success/30",
    Medium: "bg-warning/15 text-warning border-warning/30",
    Hard: "bg-destructive/15 text-destructive border-destructive/30",
    Legendary: "bg-primary/20 text-primary border-primary/40",
    Mythic: "bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-400 border-amber-500/40",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border", map[d] || map.Medium, className)}>
      {d}
    </span>
  );
}
