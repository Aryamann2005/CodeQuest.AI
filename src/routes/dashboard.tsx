import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { XPBar } from "@/components/xp-bar";
import { useAuth } from "@/lib/auth-context";
import {
  claimDailyMission,
  gameProgressKeys,
  getDailyMissions,
  getSkillProgress,
  type DailyMission,
} from "@/lib/game-progress";
import {
  Flame,
  Coins,
  Trophy,
  Target,
  Swords,
  Brain,
  Skull,
  GitBranch,
  Check,
  ArrowRight,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const [claimingMissionId, setClaimingMissionId] = useState<string | null>(null);

  const missionsQuery = useQuery({
    queryKey: gameProgressKeys.dailyMissions(user?.id ?? "anonymous"),
    queryFn: getDailyMissions,
    enabled: Boolean(user),
  });
  const progressQuery = useQuery({
    queryKey: gameProgressKeys.skillProgress(user?.id ?? "anonymous"),
    queryFn: getSkillProgress,
    enabled: Boolean(user),
  });

  async function handleClaimMission(mission: DailyMission) {
    if (!user) return;

    setClaimingMissionId(mission.mission_id);
    try {
      await claimDailyMission(mission.mission_id);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: gameProgressKeys.dailyMissions(user.id),
        }),
        queryClient.invalidateQueries({
          queryKey: gameProgressKeys.skillProgress(user.id),
        }),
        refreshProfile(),
      ]);
      toast.success(
        `Daily mission claimed! +${mission.xp_reward} XP, +${mission.coins_reward} coins`,
      );
    } catch (error: unknown) {
      console.error("Unable to claim daily mission", error);
      toast.error(error instanceof Error ? error.message : "Could not claim mission reward.");
    } finally {
      setClaimingMissionId(null);
    }
  }

  if (!profile) return null;

  const missions = missionsQuery.data ?? [];
  const skillProgress = progressQuery.data ?? [];
  const learningProgress = skillProgress.filter((skill) => skill.show_in_learning_progress);
  const progressError = getErrorMessage(progressQuery.error);
  const completedMissions = missions.filter((mission) => mission.done).length;
  const activeSkillCount = skillProgress.filter(
    (skill) => skill.unlocked && !skill.mastered,
  ).length;
  const avatar =
    profile.avatar_url ||
    `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(profile.full_name)}`;
  const xpToNext = profile.level * 500;

  return (
    <AppLayout>
      <div className="space-y-6">
        <Card className="glass-strong border-border/50 p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full gradient-hero-bg blur-3xl opacity-20" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-primary/40 shadow-[var(--shadow-glow)]">
                <AvatarImage src={avatar} />
                <AvatarFallback>{profile.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full gradient-primary-bg grid place-items-center text-xs font-bold text-white border-2 border-background">
                {profile.level}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-accent uppercase tracking-wider">
                {profile.title}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mt-1">
                Welcome, {profile.full_name.split(" ")[0]}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Level {profile.level} | Keep building your skills
              </p>
              <div className="mt-4 max-w-md">
                <XPBar value={profile.xp} max={xpToNext} />
              </div>
            </div>
            <Link to="/arena">
              <Button className="gradient-primary-bg border-0 shadow-[var(--shadow-glow)]">
                <Swords className="mr-2 h-4 w-4" /> Continue Quest
              </Button>
            </Link>
          </div>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Flame}
            label="Day Streak"
            value={profile.streak}
            color="text-warning"
            bg="bg-warning/10"
          />
          <StatCard
            icon={Coins}
            label="Coins"
            value={profile.coins.toLocaleString()}
            color="text-accent"
            bg="bg-accent/10"
          />
          <StatCard
            icon={Trophy}
            label="Problems Solved"
            value={profile.problems_solved}
            color="text-success"
            bg="bg-success/10"
          />
          <StatCard
            icon={Target}
            label="Level"
            value={profile.level}
            color="text-primary"
            bg="bg-primary/10"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass-strong border-border/50 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-lg">Daily Missions</h2>
                <p className="text-sm text-muted-foreground">
                  Resets daily | {missions.length} active
                </p>
              </div>
              <div className="text-xs px-2.5 py-1 rounded-md bg-primary/15 text-primary border border-primary/30 font-semibold">
                {completedMissions} of {missions.length} done
              </div>
            </div>
            <div className="space-y-3">
              {missionsQuery.isLoading && (
                <div className="glass rounded-xl p-4 text-sm text-muted-foreground">
                  Loading today&apos;s missions...
                </div>
              )}
              {missionsQuery.error && (
                <div className="glass rounded-xl p-4 text-sm text-destructive">
                  Daily missions could not be loaded.
                </div>
              )}
              {missions.map((mission) => (
                <div
                  key={mission.mission_id}
                  className={`glass rounded-xl p-4 flex items-center gap-4 ${
                    mission.claimed ? "opacity-60" : ""
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-lg grid place-items-center shrink-0 ${
                      mission.done ? "bg-success/20 text-success" : "gradient-primary-bg text-white"
                    }`}
                  >
                    {mission.done ? <Check className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${mission.claimed ? "line-through" : ""}`}>
                      {mission.title}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <Progress
                        value={(mission.progress / mission.total) * 100}
                        className="h-1.5 flex-1"
                      />
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">
                        {mission.progress}/{mission.total}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 space-y-2">
                    <div className="text-xs text-muted-foreground">Reward</div>
                    <div className="text-sm font-semibold flex items-center gap-1 justify-end">
                      +{mission.xp_reward}
                      <Zap className="h-3.5 w-3.5 text-accent" />
                    </div>
                    {mission.claimed ? (
                      <div className="text-xs text-success font-semibold">Claimed</div>
                    ) : mission.done ? (
                      <Button
                        size="sm"
                        className="h-7 px-3 gradient-primary-bg border-0"
                        disabled={claimingMissionId === mission.mission_id}
                        onClick={() => handleClaimMission(mission)}
                      >
                        {claimingMissionId === mission.mission_id ? "Claiming..." : "Claim"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="glass-strong border-border/50 p-6">
            <h2 className="font-semibold text-lg mb-5">Quick Actions</h2>
            <div className="space-y-3">
              <QuickAction
                to="/arena"
                icon={Swords}
                label="Practice Problems"
                desc={`${profile.problems_solved} completed`}
                color="from-primary to-secondary"
              />
              <QuickAction
                to="/boss"
                icon={Skull}
                label="Boss Battle"
                desc="Enter a themed challenge"
                color="from-rose-500 to-fuchsia-600"
              />
              <QuickAction
                to="/mentor"
                icon={Brain}
                label="Ask AI Mentor"
                desc="Work through a concept"
                color="from-cyan-500 to-blue-600"
              />
              <QuickAction
                to="/skill-tree"
                icon={GitBranch}
                label="Skill Tree"
                desc={`${activeSkillCount} skills in progress`}
                color="from-emerald-500 to-cyan-500"
              />
            </div>
          </Card>
        </div>

        <Card className="glass-strong border-border/50 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg">Learning Progress</h2>
            <Link
              to="/skill-tree"
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              View skill tree <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {progressQuery.isLoading && (
            <div className="text-sm text-muted-foreground">
              Calculating progress from completed challenges...
            </div>
          )}
          {progressQuery.error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="text-sm font-medium text-destructive">
                Learning progress could not be loaded.
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{progressError}</div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                disabled={progressQuery.isFetching}
                onClick={() => void progressQuery.refetch()}
              >
                {progressQuery.isFetching ? "Retrying..." : "Retry"}
              </Button>
            </div>
          )}
          {progressQuery.isSuccess && learningProgress.length === 0 && (
            <div className="rounded-xl border border-border/50 bg-muted/20 p-5 text-sm text-muted-foreground">
              No learning progress yet. Complete your first challenge in the Coding Arena to get
              started.
            </div>
          )}
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningProgress.map((skill) => (
              <div key={skill.skill_id} className="glass rounded-xl p-4">
                <div className="flex justify-between items-baseline mb-2 gap-3">
                  <div className="font-medium text-sm">{skill.name}</div>
                  <div className="text-xs font-mono tabular-nums text-muted-foreground shrink-0">
                    {skill.progress_percent}%
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full gradient-hero-bg rounded-full transition-[width] duration-500"
                    style={{ width: `${skill.progress_percent}%` }}
                  />
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {skill.completed_challenges} of {skill.total_challenges} challenges completed
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "Supabase returned an unknown error. Check that the progress migration was applied.";
}

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  color: string;
  bg: string;
};

function StatCard({ icon: Icon, label, value, color, bg }: StatCardProps) {
  return (
    <Card className="glass-strong border-border/50 p-5">
      <div className="flex items-center gap-3">
        <div className={`h-11 w-11 rounded-xl ${bg} grid place-items-center`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-bold tabular-nums">{value}</div>
        </div>
      </div>
    </Card>
  );
}

type QuickActionProps = {
  to: "/arena" | "/boss" | "/mentor" | "/skill-tree";
  icon: LucideIcon;
  label: string;
  desc: string;
  color: string;
};

function QuickAction({ to, icon: Icon, label, desc, color }: QuickActionProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 glass rounded-xl p-3 hover:bg-sidebar-accent hover:-translate-y-0.5 transition-all group"
    >
      <div
        className={`h-10 w-10 rounded-lg bg-gradient-to-br ${color} grid place-items-center shrink-0 shadow-md`}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground truncate">{desc}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition" />
    </Link>
  );
}
