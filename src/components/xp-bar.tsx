import { cn } from "@/lib/utils";

export function XPBar({ value, max, className, showLabel = true }: { value: number; max: number; className?: string; showLabel?: boolean }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">XP</span>
          <span className="font-semibold tabular-nums">{value.toLocaleString()} / {max.toLocaleString()}</span>
        </div>
      )}
      <div className="h-2.5 rounded-full bg-muted/50 overflow-hidden relative">
        <div className="h-full gradient-hero-bg rounded-full transition-all duration-700 relative overflow-hidden" style={{ width: `${pct}%` }}>
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
