import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { gameProgressKeys, getSkillEdges, getSkillProgress } from "@/lib/game-progress";
import { Lock, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/skill-tree")({
  component: SkillTreePage,
});

function SkillTreePage() {
  const { user } = useAuth();
  const progressQuery = useQuery({
    queryKey: gameProgressKeys.skillProgress(user?.id ?? "anonymous"),
    queryFn: getSkillProgress,
    enabled: Boolean(user),
  });
  const edgesQuery = useQuery({
    queryKey: gameProgressKeys.skillEdges,
    queryFn: getSkillEdges,
    enabled: Boolean(user),
  });

  const skillTree = progressQuery.data ?? [];
  const skillEdges = edgesQuery.data ?? [];
  const unlockedCount = skillTree.filter((node) => node.unlocked).length;

  if (progressQuery.isLoading || edgesQuery.isLoading) {
    return (
      <AppLayout>
        <Card className="glass-strong border-border/50 p-6 text-sm text-muted-foreground">
          Building your skill tree from saved challenge activity...
        </Card>
      </AppLayout>
    );
  }

  if (progressQuery.error || edgesQuery.error) {
    return (
      <AppLayout>
        <Card className="glass-strong border-border/50 p-6">
          <h1 className="text-xl font-semibold">Skill tree unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your saved skill progress could not be loaded.
          </p>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Skill Tree</h1>
        <p className="text-muted-foreground mt-1">
          Master each branch to unlock new realms. {unlockedCount} of {skillTree.length} nodes
          available.
        </p>
      </div>

      <Card className="glass-strong border-border/50 p-4 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative w-full" style={{ aspectRatio: "16/9", minHeight: 420 }}>
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {skillEdges.map((edge) => {
              const parent = skillTree.find((node) => node.skill_id === edge.parent_skill_id);
              const child = skillTree.find((node) => node.skill_id === edge.child_skill_id);

              if (!parent || !child) return null;

              const active = parent.unlocked && child.unlocked;
              return (
                <line
                  key={`${edge.parent_skill_id}-${edge.child_skill_id}`}
                  x1={parent.position_x}
                  y1={parent.position_y}
                  x2={child.position_x}
                  y2={child.position_y}
                  stroke={active ? "url(#grad)" : "rgba(255,255,255,0.08)"}
                  strokeWidth="0.4"
                  strokeDasharray={active ? "0" : "1 1"}
                />
              );
            })}
            <defs>
              <linearGradient id="grad" x1="0" x2="1">
                <stop offset="0" stopColor="oklch(0.58 0.24 295)" />
                <stop offset="1" stopColor="oklch(0.72 0.15 210)" />
              </linearGradient>
            </defs>
          </svg>

          {skillTree.map((node) => {
            const lockedReason = `Requires ${node.required_challenges} completed challenges and ${node.required_xp} XP`;
            const progressLabel =
              node.total_challenges > 0
                ? `${node.completed_challenges}/${node.total_challenges} complete`
                : "No challenges yet";

            return (
              <div
                key={node.skill_id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${node.position_x}%`,
                  top: `${node.position_y}%`,
                }}
              >
                <div
                  title={node.unlocked ? progressLabel : lockedReason}
                  className={cn(
                    "group relative w-20 sm:w-28 rounded-2xl p-2.5 sm:p-3 text-center transition-all hover:scale-110 cursor-pointer",
                    node.mastered && "gradient-primary-bg shadow-[var(--shadow-glow)]",
                    node.unlocked &&
                      !node.mastered &&
                      "glass-strong border border-primary/40 animate-pulse-glow",
                    !node.unlocked && "glass border border-dashed opacity-60",
                  )}
                >
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl grid place-items-center mx-auto bg-background/40">
                    {!node.unlocked ? (
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    ) : node.mastered ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    ) : (
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "mt-1.5 sm:mt-2 font-semibold text-[10px] sm:text-xs leading-tight",
                      node.mastered && "text-white",
                    )}
                  >
                    {node.name}
                  </div>
                  <div
                    className={cn(
                      "text-[9px] sm:text-[10px] mt-0.5",
                      node.mastered ? "text-white/80" : "text-muted-foreground",
                    )}
                  >
                    {!node.unlocked ? "Locked" : node.mastered ? "Mastered" : progressLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mt-8 flex flex-wrap gap-6 justify-center text-xs text-muted-foreground border-t border-border/50 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded gradient-primary-bg" /> Mastered
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded border border-primary/40" /> Unlocked
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded border border-dashed border-muted-foreground" /> Locked
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}
