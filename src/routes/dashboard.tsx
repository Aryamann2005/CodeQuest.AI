import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { XPBar } from "@/components/xp-bar";
import { user, dailyMissions, learningProgress } from "@/lib/mock-data";
import { Flame, Coins, Trophy, Target, Swords, Brain, Skull, GitBranch, Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero card */}
        <Card className="glass-strong border-border/50 p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full gradient-hero-bg blur-3xl opacity-20" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-primary/40 shadow-[var(--shadow-glow)]">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full gradient-primary-bg grid place-items-center text-xs font-bold text-white border-2 border-background">{user.level}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-accent uppercase tracking-wider">{user.title}</div>
              <h1 className="text-2xl lg:text-3xl font-bold mt-1">Welcome back, {user.name.split(" ")[0]} ⚔️</h1>
              <p className="text-sm text-muted-foreground mt-1">Lv {user.level} · Rank #{user.globalRank} globally</p>
              <div className="mt-4 max-w-md"><XPBar value={user.xp} max={user.xpToNext} /></div>
            </div>
            <Link to="/arena"><Button className="gradient-primary-bg border-0 shadow-[var(--shadow-glow)]"><Swords className="mr-2 h-4 w-4" /> Continue Quest</Button></Link>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Flame} label="Day Streak" value={user.streak} color="text-warning" bg="bg-warning/10" />
          <StatCard icon={Coins} label="Coins" value={user.coins.toLocaleString()} color="text-accent" bg="bg-accent/10" />
          <StatCard icon={Trophy} label="Problems Solved" value={user.problemsSolved} color="text-success" bg="bg-success/10" />
          <StatCard icon={Target} label="Global Rank" value={`#${user.globalRank}`} color="text-primary" bg="bg-primary/10" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Daily missions */}
          <Card className="lg:col-span-2 glass-strong border-border/50 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-lg">Daily Missions</h2>
                <p className="text-sm text-muted-foreground">Resets in 8h 32m · 4 active</p>
              </div>
              <div className="text-xs px-2.5 py-1 rounded-md bg-primary/15 text-primary border border-primary/30 font-semibold">3 of 4 done</div>
            </div>
            <div className="space-y-3">
              {dailyMissions.map(m => (
                <div key={m.id} className={`glass rounded-xl p-4 flex items-center gap-4 ${m.done ? "opacity-60" : ""}`}>
                  <div className={`h-10 w-10 rounded-lg grid place-items-center shrink-0 ${m.done ? "bg-success/20 text-success" : "gradient-primary-bg text-white"}`}>
                    {m.done ? <Check className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${m.done ? "line-through" : ""}`}>{m.title}</div>
                    <div className="mt-2 flex items-center gap-3">
                      <Progress value={(m.progress / m.total) * 100} className="h-1.5 flex-1" />
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">{m.progress}/{m.total}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground">Reward</div>
                    <div className="text-sm font-semibold flex items-center gap-1">+{m.xp} <span className="text-accent">⚡</span></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick actions */}
          <Card className="glass-strong border-border/50 p-6">
            <h2 className="font-semibold text-lg mb-5">Quick Actions</h2>
            <div className="space-y-3">
              <QuickAction to="/arena" icon={Swords} label="Practice Problems" desc="500+ curated" color="from-primary to-secondary" />
              <QuickAction to="/boss" icon={Skull} label="Boss Battle" desc="Graph Dragon · 72% HP" color="from-rose-500 to-fuchsia-600" />
              <QuickAction to="/mentor" icon={Brain} label="Ask AI Mentor" desc="Stuck on a concept?" color="from-cyan-500 to-blue-600" />
              <QuickAction to="/skill-tree" icon={GitBranch} label="Skill Tree" desc="2 nodes ready to unlock" color="from-emerald-500 to-cyan-500" />
            </div>
          </Card>
        </div>

        {/* Learning progress */}
        <Card className="glass-strong border-border/50 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg">Learning Progress</h2>
            <Link to="/skill-tree" className="text-sm text-accent hover:underline flex items-center gap-1">View skill tree <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningProgress.map(t => (
              <div key={t.topic} className="glass rounded-xl p-4">
                <div className="flex justify-between items-baseline mb-2">
                  <div className="font-medium text-sm">{t.topic}</div>
                  <div className="text-xs font-mono tabular-nums text-muted-foreground">{t.progress}%</div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full gradient-hero-bg rounded-full" style={{ width: `${t.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <Card className="glass-strong border-border/50 p-5">
      <div className="flex items-center gap-3">
        <div className={`h-11 w-11 rounded-xl ${bg} grid place-items-center`}><Icon className={`h-5 w-5 ${color}`} /></div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-bold tabular-nums">{value}</div>
        </div>
      </div>
    </Card>
  );
}

function QuickAction({ to, icon: Icon, label, desc, color }: any) {
  return (
    <Link to={to} className="block glass rounded-xl p-3 flex items-center gap-3 hover:bg-sidebar-accent transition group">
      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${color} grid place-items-center shrink-0`}><Icon className="h-5 w-5 text-white" /></div>
      <div className="flex-1 min-w-0"><div className="font-medium text-sm">{label}</div><div className="text-xs text-muted-foreground truncate">{desc}</div></div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition" />
    </Link>
  );
}
