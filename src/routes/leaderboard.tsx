import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { leaderboard } from "@/lib/mock-data";
import { Trophy, Crown, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({ component: Lb });

function Lb() {
  return (
    <AppLayout>
      <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3"><Trophy className="h-7 w-7 text-warning" /> Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Climb the ranks. Glory awaits.</p>
        </div>
        <div className="glass rounded-xl px-4 py-2 text-sm">Your rank: <span className="font-bold text-primary">#342</span> globally</div>
      </div>

      <Tabs defaultValue="global">
        <TabsList className="glass">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="college">College</TabsTrigger>
        </TabsList>
        {(["global", "friends", "college"] as const).map(tab => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <Card className="glass-strong border-border/50 overflow-hidden">
              <table className="w-full">
                <thead className="bg-background/40 border-b border-border/50">
                  <tr className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    <th className="text-left p-4 w-20">Rank</th>
                    <th className="text-left p-4">Hero</th>
                    <th className="text-right p-4 hidden sm:table-cell">XP</th>
                    <th className="text-right p-4">Solved</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard[tab].map((u, i, arr) => {
                    const prev = arr[i - 1];
                    const showGap = prev && u.rank - prev.rank > 1;
                    return (
                      <>
                        {showGap && (
                          <tr key={`gap-${u.rank}`}><td colSpan={4} className="p-2 text-center text-xs text-muted-foreground font-mono">· · ·</td></tr>
                        )}
                        <tr key={u.rank} className={cn("border-b border-border/30 transition", u.you ? "bg-primary/10 ring-1 ring-inset ring-primary/30" : "hover:bg-sidebar-accent/30")}>
                          <td className="p-4"><RankBadge rank={u.rank} /></td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 ring-2 ring-border"><AvatarImage src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${u.avatar}`} /><AvatarFallback>{u.name[0]}</AvatarFallback></Avatar>
                              <div className="min-w-0">
                                <div className={cn("font-semibold text-sm truncate", u.you && "text-primary")}>{u.name}</div>
                                <div className="text-xs text-muted-foreground truncate">{u.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right font-mono tabular-nums hidden sm:table-cell">{u.xp.toLocaleString()}</td>
                          <td className="p-4 text-right font-mono tabular-nums">{u.solved}</td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </AppLayout>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <div className="flex items-center gap-1.5 text-warning font-bold"><Crown className="h-5 w-5" /> 1</div>;
  if (rank === 2) return <div className="flex items-center gap-1.5 text-muted-foreground font-bold"><Medal className="h-5 w-5" /> 2</div>;
  if (rank === 3) return <div className="flex items-center gap-1.5 text-amber-600 font-bold"><Medal className="h-5 w-5" /> 3</div>;
  return <div className="font-mono font-semibold text-muted-foreground">#{rank}</div>;
}
