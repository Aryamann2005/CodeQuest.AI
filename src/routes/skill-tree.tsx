import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { skillTree, skillEdges } from "@/lib/mock-data";
import { Lock, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/skill-tree")({ component: SkillTreePage });

function SkillTreePage() {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Skill Tree</h1>
        <p className="text-muted-foreground mt-1">Master each branch to unlock new realms. 6 of 8 nodes available.</p>
      </div>

      <Card className="glass-strong border-border/50 p-4 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative w-full" style={{ aspectRatio: "16/9", minHeight: 420 }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
            {skillEdges.map(([a, b], i) => {
              const A = skillTree.find(n => n.id === a)!;
              const B = skillTree.find(n => n.id === b)!;
              const active = A.unlocked && B.unlocked;
              return (
                <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                  stroke={active ? "url(#grad)" : "rgba(255,255,255,0.08)"}
                  strokeWidth="0.4" strokeDasharray={active ? "0" : "1 1"} />
              );
            })}
            <defs>
              <linearGradient id="grad" x1="0" x2="1">
                <stop offset="0" stopColor="oklch(0.58 0.24 295)" />
                <stop offset="1" stopColor="oklch(0.72 0.15 210)" />
              </linearGradient>
            </defs>
          </svg>

          {skillTree.map(n => (
            <div key={n.id} className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}>
              <div className={cn(
                "group relative w-20 sm:w-28 rounded-2xl p-2.5 sm:p-3 text-center transition-all hover:scale-110 cursor-pointer",
                n.completed && "gradient-primary-bg shadow-[var(--shadow-glow)]",
                n.unlocked && !n.completed && "glass-strong border border-primary/40 animate-pulse-glow",
                !n.unlocked && "glass border border-dashed opacity-60"
              )}>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl grid place-items-center mx-auto bg-background/40">
                  {!n.unlocked ? <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" /> :
                   n.completed ? <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" /> :
                   <Star className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />}
                </div>
                <div className={cn("mt-1.5 sm:mt-2 font-semibold text-[10px] sm:text-xs leading-tight", n.completed && "text-white")}>{n.name}</div>
                <div className={cn("text-[9px] sm:text-[10px] mt-0.5", n.completed ? "text-white/80" : "text-muted-foreground")}>
                  {n.unlocked ? (n.completed ? "Mastered" : `Lv ${n.level}`) : "Locked"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-8 flex flex-wrap gap-6 justify-center text-xs text-muted-foreground border-t border-border/50 pt-4">
          <div className="flex items-center gap-2"><div className="h-3 w-3 rounded gradient-primary-bg" /> Mastered</div>
          <div className="flex items-center gap-2"><div className="h-3 w-3 rounded border border-primary/40" /> Unlocked</div>
          <div className="flex items-center gap-2"><div className="h-3 w-3 rounded border border-dashed border-muted-foreground" /> Locked</div>
        </div>
      </Card>
    </AppLayout>
  );
}
