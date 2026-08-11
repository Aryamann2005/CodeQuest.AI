import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { useAuth } from "@/lib/auth-context";
import {
  claimBossReward,
  completeProblem,
  gameProgressKeys,
  getBossBattles,
  type BossBattle as BossBattleType,
} from "@/lib/game-progress";
import {
  createStarterCode,
  getChallengeTests,
  runCode,
  type CodeLanguage,
  type RunResult,
} from "@/lib/code-runner";
import { Check, Coins, FileCode, Play, Shield, Skull, Sparkles, Swords, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/boss")({ component: BossBattle });

function BossBattle() {
  const { user, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [language, setLanguage] = useState<CodeLanguage>("javascript");
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [runState, setRunState] = useState<{ bossId: string; result: RunResult } | null>(null);
  const [running, setRunning] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const bossesQuery = useQuery({
    queryKey: gameProgressKeys.bossBattles(user?.id ?? "anonymous"),
    queryFn: getBossBattles,
    enabled: Boolean(user),
  });

  const bosses = bossesQuery.data ?? [];
  const selected = bosses.find((boss) => boss.boss_id === selectedId) ?? bosses[0];

  if (bossesQuery.isLoading) {
    return <AppLayout><Card className="glass-strong p-6 text-muted-foreground">Summoning bosses...</Card></AppLayout>;
  }
  if (bossesQuery.error || !selected) {
    return (
      <AppLayout>
        <Card className="glass-strong p-6">
          <h1 className="text-xl font-semibold text-destructive">Boss battles unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Run supabase/boss-battles.sql in Supabase SQL Editor, then retry.
          </p>
          <Button className="mt-4" variant="outline" onClick={() => void bossesQuery.refetch()}>Retry</Button>
        </Card>
      </AppLayout>
    );
  }

  const tests = getChallengeTests(selected.challenge_id);
  const solutionKey = `${language}:${selected.boss_id}`;
  const code = solutions[solutionKey] ?? createStarterCode(selected.challenge_title, language, selected.challenge_id);
  const currentRun = runState?.bossId === selected.boss_id ? runState.result : null;
  const passedTests = currentRun?.results.filter((result) => result.passed).length ?? 0;
  const hp = selected.defeated
    ? 0
    : Math.max(1, selected.max_hp - Math.floor((selected.max_hp * passedTests) / tests.length));
  const hpPercent = (hp / selected.max_hp) * 100;

  async function attackBoss() {
    setRunning(true);
    try {
      const result = await runCode(language, selected.challenge_id, code, tests);
      setRunState({ bossId: selected.boss_id, result });
      if (!result.passed) {
        toast.error("The boss blocked your attack. Fix the failed tests and strike again.");
        return;
      }

      await completeProblem(selected.challenge_id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: gameProgressKeys.bossBattles(user!.id) }),
        queryClient.invalidateQueries({ queryKey: gameProgressKeys.completedProblems(user!.id) }),
        queryClient.invalidateQueries({ queryKey: gameProgressKeys.skillProgress(user!.id) }),
        queryClient.invalidateQueries({ queryKey: gameProgressKeys.dailyMissions(user!.id) }),
        refreshProfile(),
      ]);
      toast.success(`${selected.name} defeated! Your boss reward is ready to claim.`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRunning(false);
    }
  }

  async function claimReward() {
    setClaiming(true);
    try {
      await claimBossReward(selected.boss_id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: gameProgressKeys.bossBattles(user!.id) }),
        refreshProfile(),
      ]);
      toast.success(`Loot claimed: +${selected.xp_reward} XP and +${selected.coin_reward} coins!`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setClaiming(false);
    }
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold lg:text-3xl">
          <Skull className="h-7 w-7 text-primary" /> Boss Battles
        </h1>
        <p className="mt-1 text-muted-foreground">Write working code, pass every test, and earn one-time boss loot.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Card className="glass-strong relative overflow-hidden border-border/50 p-6">
            <div className="absolute inset-0 gradient-hero-bg opacity-10" />
            <div className="relative grid items-center gap-6 md:grid-cols-[150px_1fr]">
              <div className="text-center text-8xl animate-float">{selected.image}</div>
              <div>
                <DifficultyBadge d={selected.difficulty} />
                <h2 className="mt-2 text-3xl font-bold">{selected.name}</h2>
                <p className="text-muted-foreground">{selected.title}</p>
                <div className="mt-5 flex justify-between text-sm">
                  <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-destructive" /> HP</span>
                  <span className="font-mono">{hp} / {selected.max_hp}</span>
                </div>
                <div className="mt-2 h-3.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-gradient-to-r from-destructive to-warning transition-all duration-500" style={{ width: `${hpPercent}%` }} />
                </div>
                {selected.defeated && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-2 text-sm font-semibold text-success"><Sparkles className="h-4 w-4" /> Boss defeated</span>
                    <Button onClick={() => void claimReward()} disabled={selected.claimed || claiming}>
                      {selected.claimed ? "Rewards Claimed" : claiming ? "Claiming..." : "Claim Rewards"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="glass-strong border-border/50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-accent">Boss challenge</div>
                <h3 className="mt-1 text-xl font-bold">{selected.challenge_title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{selected.description}</p>
              </div>
              <span className="text-sm text-muted-foreground">{passedTests}/{tests.length} tests passed</span>
            </div>
          </Card>

          <Card className="glass-strong overflow-hidden border-border/50">
            <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2.5">
              <FileCode className="h-4 w-4 text-accent" />
              <span className="font-mono text-xs">battle.{language === "javascript" ? "js" : language === "python" ? "py" : "cpp"}</span>
              <Select value={language} onValueChange={(value) => { setLanguage(value as CodeLanguage); setRunState(null); }}>
                <SelectTrigger className="ml-auto h-8 w-[130px] font-mono text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={code}
              onChange={(event) => { setSolutions((current) => ({ ...current, [solutionKey]: event.target.value })); setRunState(null); }}
              spellCheck={false}
              className="min-h-[330px] resize-y rounded-none border-0 bg-[#0a0f1e] p-4 font-mono text-sm leading-6 text-slate-100 focus-visible:ring-0"
            />
            <div className="flex justify-end border-t border-border/50 p-4">
              <Button className="gradient-primary-bg border-0" onClick={() => void attackBoss()} disabled={running || selected.defeated}>
                {running ? <Play className="mr-2 h-4 w-4 animate-pulse" /> : <Swords className="mr-2 h-4 w-4" />}
                {selected.defeated ? "Boss Defeated" : running ? "Attacking..." : "Run & Attack"}
              </Button>
            </div>
          </Card>

          {currentRun && (
            <Card className="glass-strong border-border/50 p-5">
              <h3 className="mb-3 font-semibold">Battle Log</h3>
              <div className="space-y-2">
                {currentRun.results.map((result, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-lg bg-[#0a0f1e] p-3 font-mono text-xs">
                    {result.passed ? <Check className="h-4 w-4 shrink-0 text-success" /> : <X className="h-4 w-4 shrink-0 text-destructive" />}
                    <div>
                      <div className={result.passed ? "text-success" : "text-destructive"}>Test {index + 1}: {result.passed ? "Hit landed" : "Attack blocked"}</div>
                      {result.error && <div className="mt-1 whitespace-pre-wrap text-destructive">{result.error}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="glass-strong border-border/50 p-5">
            <h3 className="font-semibold">Victory Loot</h3>
            <div className="mt-4 space-y-2">
              <Reward icon="⚡" label="Experience" value={`+${selected.xp_reward} XP`} />
              <Reward icon={<Coins className="h-4 w-4 text-accent" />} label="Coins" value={`+${selected.coin_reward}`} />
              <Reward icon="🏆" label="Item" value={selected.item_reward} />
            </div>
          </Card>
          <Card className="glass-strong border-border/50 p-5">
            <h3 className="mb-3 font-semibold">Available Bosses</h3>
            <div className="space-y-2">
              {bosses.map((boss) => (
                <BossButton key={boss.boss_id} boss={boss} selected={boss.boss_id === selected.boss_id} onClick={() => { setSelectedId(boss.boss_id); setRunState(null); }} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function BossButton({ boss, selected, onClick }: { boss: BossBattleType; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`glass w-full rounded-xl p-3 text-left transition ${selected ? "ring-2 ring-primary" : ""}`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{boss.image}</span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{boss.name}</div>
          <div className="text-xs text-muted-foreground">{boss.difficulty}{boss.defeated ? " · Defeated" : ""}</div>
        </div>
        {boss.claimed && <Check className="h-4 w-4 text-success" />}
      </div>
    </button>
  );
}

function Reward({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="glass flex items-center gap-3 rounded-lg p-3"><div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15">{icon}</div><div><div className="text-xs text-muted-foreground">{label}</div><div className="text-sm font-semibold">{value}</div></div></div>;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "The battle could not be completed.";
}
