import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { bosses, damageLog } from "@/lib/mock-data";
import { Swords, Coins, Sparkles, Shield, Skull, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/boss")({ component: BossBattle });

function BossBattle() {
  const [selected, setSelected] = useState(bosses[0]);
  const hpPct = (selected.hp / selected.maxHp) * 100;

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3"><Skull className="h-7 w-7 text-primary" /> Boss Battles</h1>
        <p className="text-muted-foreground mt-1">Defeat coding bosses by mastering themed problem sets. Loot awaits the bold.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          {/* Boss card */}
          <Card className="glass-strong border-border/50 p-6 lg:p-8 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${selected.color} opacity-20`} />
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="relative grid md:grid-cols-[200px_1fr] gap-6 items-center">
              <div className="text-center">
                <div className="text-[8rem] leading-none animate-float">{selected.image}</div>
              </div>
              <div>
                <DifficultyBadge d={selected.difficulty} />
                <h2 className="text-3xl lg:text-4xl font-bold mt-2">{selected.name}</h2>
                <p className="text-muted-foreground italic">{selected.title}</p>

                <div className="mt-5 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-destructive" /> HP</span>
                      <span className="font-mono tabular-nums">{selected.hp.toLocaleString()} / {selected.maxHp.toLocaleString()}</span>
                    </div>
                    <div className="h-3.5 rounded-full bg-muted/60 overflow-hidden border border-border/50">
                      <div className={cn("h-full transition-all duration-700 relative overflow-hidden",
                        hpPct > 60 ? "bg-gradient-to-r from-success to-warning" :
                        hpPct > 30 ? "bg-gradient-to-r from-warning to-destructive" :
                        "bg-gradient-to-r from-destructive to-rose-700"
                      )} style={{ width: `${hpPct}%` }}>
                        <div className="absolute inset-0 animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {selected.defeated ? (
                    <>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-success/15 border border-success/40 text-success font-semibold text-sm">
                        <Sparkles className="h-4 w-4" /> Victory · Boss Defeated
                      </div>
                      <Button variant="outline" className="glass">Claim Rewards</Button>
                    </>
                  ) : (
                    <>
                      <Button className="gradient-primary-bg border-0 shadow-[var(--shadow-glow)]" onClick={() => toast.success("Critical hit! -120 HP")}>
                        <Swords className="h-4 w-4 mr-2" /> Attack (Solve Problem)
                      </Button>
                      <Button variant="outline" className="glass"><Sparkles className="h-4 w-4 mr-2 text-accent" /> Use Hint Card</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Attack progress */}
          <Card className="glass-strong border-border/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Battle Progress</h3>
              <span className="text-sm text-muted-foreground">{selected.progress}% complete</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden mb-4">
              <div className="h-full gradient-hero-bg" style={{ width: `${selected.progress}%` }} />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="glass rounded-xl p-4"><div className="text-xs text-muted-foreground">Hits Landed</div><div className="text-2xl font-bold mt-1">14</div></div>
              <div className="glass rounded-xl p-4"><div className="text-xs text-muted-foreground">Critical Hits</div><div className="text-2xl font-bold mt-1 text-warning">3</div></div>
              <div className="glass rounded-xl p-4"><div className="text-xs text-muted-foreground">Battle Time</div><div className="text-2xl font-bold mt-1">2d 4h</div></div>
            </div>
          </Card>

          {/* Damage log */}
          <Card className="glass-strong border-border/50 p-6">
            <h3 className="font-semibold mb-4">Recent Damage Log</h3>
            <div className="space-y-2">
              {damageLog.map((d, i) => (
                <div key={i} className="flex items-center gap-3 glass rounded-lg p-3">
                  <div className={cn("h-8 w-8 rounded-lg grid place-items-center shrink-0",
                    d.damage > 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")}>
                    {d.damage > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{d.action}</div><div className="text-xs text-muted-foreground">{d.time}</div></div>
                  <div className={cn("font-mono font-bold tabular-nums", d.damage > 0 ? "text-success" : "text-destructive")}>{d.damage > 0 ? "+" : ""}{d.damage}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Boss selector + rewards */}
        <div className="space-y-4">
          <Card className="glass-strong border-border/50 p-5">
            <h3 className="font-semibold mb-1">Rewards</h3>
            <p className="text-xs text-muted-foreground mb-4">For defeating {selected.name}</p>
            <div className="space-y-2">
              <RewardRow icon="⚡" label="Experience" value={`+${selected.rewards.xp.toLocaleString()} XP`} />
              <RewardRow icon={<Coins className="h-4 w-4 text-accent" />} label="Coins" value={`+${selected.rewards.coins}`} />
              <RewardRow icon="🏆" label="Item" value={selected.rewards.item} />
            </div>
          </Card>

          <Card className="glass-strong border-border/50 p-5">
            <h3 className="font-semibold mb-3">Available Bosses</h3>
            <div className="space-y-2">
              {bosses.map(b => (
                <button key={b.id} onClick={() => setSelected(b)} className={cn("w-full text-left glass rounded-xl p-3 transition", selected.id === b.id && "ring-2 ring-primary")}>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{b.image}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate flex items-center gap-2">
                        {b.name}
                        {b.defeated && <span className="text-xs text-success">✓ Defeated</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">{b.difficulty}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function RewardRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 glass rounded-lg p-3">
      <div className="h-8 w-8 rounded-lg bg-primary/15 grid place-items-center text-lg">{icon}</div>
      <div className="flex-1"><div className="text-xs text-muted-foreground">{label}</div><div className="font-semibold text-sm">{value}</div></div>
    </div>
  );
}
