import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { XPBar } from "@/components/xp-bar";
import { user, achievements, activityHistory } from "@/lib/mock-data";
import { Flame, Coins, Trophy, Edit, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({ component: Profile });

const rarityStyles: Record<string, string> = {
  common: "border-border bg-muted/30",
  rare: "border-blue-500/40 bg-blue-500/10",
  epic: "border-primary/40 bg-primary/10",
  legendary: "border-warning/40 bg-warning/10",
  mythic: "border-amber-400/50 bg-gradient-to-br from-amber-500/15 to-rose-500/15",
};

function Profile() {
  return (
    <AppLayout>
      <Card className="glass-strong border-border/50 p-6 lg:p-8 relative overflow-hidden mb-6">
        <div className="absolute inset-0 gradient-hero-bg opacity-10" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <Avatar className="h-28 w-28 ring-4 ring-primary/40 shadow-[var(--shadow-glow)]">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full gradient-primary-bg grid place-items-center font-bold text-white border-2 border-background">{user.level}</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-mono text-accent uppercase tracking-wider">{user.title}</div>
            <h1 className="text-3xl font-bold mt-1">{user.name}</h1>
            <p className="text-muted-foreground text-sm">{user.username} · Joined Jan 2026</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Stat icon={<Flame className="h-4 w-4 text-warning" />} label={`${user.streak} day streak`} />
              <Stat icon={<Coins className="h-4 w-4 text-accent" />} label={`${user.coins.toLocaleString()} coins`} />
              <Stat icon={<Trophy className="h-4 w-4 text-success" />} label={`${user.problemsSolved} solved`} />
            </div>
            <div className="mt-4 max-w-md"><XPBar value={user.xp} max={user.xpToNext} /></div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glass"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
            <Button className="gradient-primary-bg border-0"><Edit className="h-4 w-4 mr-2" /> Edit</Button>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="achievements">
        <TabsList className="glass"><TabsTrigger value="achievements">Achievements</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map(a => (
              <Card key={a.id} className={cn("p-5 border-2 transition-all hover:-translate-y-1", rarityStyles[a.rarity], !a.unlocked && "opacity-40 grayscale")}>
                <div className="text-4xl">{a.icon}</div>
                <div className="font-semibold mt-3">{a.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
                <div className="text-[10px] font-mono uppercase tracking-wider mt-2 opacity-70">{a.rarity}</div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card className="glass-strong border-border/50 p-6">
            <div className="space-y-2">
              {activityHistory.map((a, i) => (
                <div key={i} className="flex items-center gap-3 glass rounded-lg p-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/15 grid place-items-center text-primary">⚡</div>
                  <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{a.action}</div><div className="text-xs text-muted-foreground">{a.date}</div></div>
                  <div className="font-mono font-semibold text-success">+{a.xp} XP</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function Stat({ icon, label }: any) {
  return <div className="glass rounded-full px-3 py-1.5 flex items-center gap-2">{icon}<span className="font-medium">{label}</span></div>;
}
