import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XPBar } from "@/components/xp-bar";
import { useAuth } from "@/lib/auth-context";
import { gameProgressKeys, getBossBattles, getProfileActivity } from "@/lib/game-progress";
import { supabase } from "@/lib/supabase";
import { Check, Coins, Edit, Flame, Lock, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: string;
};

function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");

  const activityQuery = useQuery({
    queryKey: gameProgressKeys.profileActivity(user?.id ?? "anonymous"),
    queryFn: getProfileActivity,
    enabled: Boolean(user),
  });
  const bossesQuery = useQuery({
    queryKey: gameProgressKeys.bossBattles(user?.id ?? "anonymous"),
    queryFn: getBossBattles,
    enabled: Boolean(user),
    retry: false,
  });

  if (!profile || !user) return null;

  const avatar =
    profile.avatar_url ||
    `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(profile.full_name)}`;
  const username = `@${(user.email?.split("@")[0] ?? profile.full_name).replace(/[^a-zA-Z0-9_]/g, "")}`;
  const joined = new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(
    new Date(profile.created_at),
  );
  const defeatedBosses = (bossesQuery.data ?? []).filter((boss) => boss.defeated).length;
  const achievements = createAchievements(profile.level, profile.problems_solved, profile.streak, profile.coins, defeatedBosses);

  async function saveProfile() {
    const name = fullName.trim();
    if (name.length < 2) {
      toast.error("Your display name must contain at least two characters.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name, avatar_url: avatarUrl.trim() || null })
        .eq("id", user!.id);
      if (error) throw error;
      await refreshProfile();
      setEditing(false);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <Card className="glass-strong relative mb-6 overflow-hidden border-border/50 p-6 lg:p-8">
        <div className="absolute inset-0 gradient-hero-bg opacity-10" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-28 w-28 ring-4 ring-primary/40 shadow-[var(--shadow-glow)]">
              <AvatarImage src={avatar} />
              <AvatarFallback>{initials(profile.full_name)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full border-2 border-background gradient-primary-bg font-bold text-white">
              {profile.level}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-mono text-xs uppercase tracking-wider text-accent">{profile.title}</div>
            <h1 className="mt-1 text-3xl font-bold">{profile.full_name}</h1>
            <p className="text-sm text-muted-foreground">{username} · Joined {joined}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Stat icon={<Flame className="h-4 w-4 text-warning" />} label={`${profile.streak} day streak`} />
              <Stat icon={<Coins className="h-4 w-4 text-accent" />} label={`${profile.coins.toLocaleString()} coins`} />
              <Stat icon={<Trophy className="h-4 w-4 text-success" />} label={`${profile.problems_solved} solved`} />
            </div>
            <div className="mt-4 max-w-md"><XPBar value={profile.xp} max={profile.level * 500} /></div>
          </div>
          <Button
            className="gradient-primary-bg border-0"
            onClick={() => {
              setFullName(profile.full_name);
              setAvatarUrl(profile.avatar_url ?? "");
              setEditing(true);
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="achievements">
        <TabsList className="glass">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`border-2 p-5 transition-all ${achievement.unlocked ? "border-primary/40 bg-primary/10" : "border-border bg-muted/20 opacity-60"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-4xl">{achievement.icon}</div>
                  {achievement.unlocked ? <Check className="h-5 w-5 text-success" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="mt-3 font-semibold">{achievement.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{achievement.description}</div>
                <div className="mt-3 font-mono text-[11px] text-accent">{achievement.progress}</div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card className="glass-strong border-border/50 p-6">
            {activityQuery.isLoading && <div className="text-sm text-muted-foreground">Loading your activity...</div>}
            {activityQuery.error && <div className="text-sm text-destructive">Activity could not be loaded.</div>}
            {activityQuery.isSuccess && activityQuery.data.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">Complete your first Coding Arena challenge to create activity.</div>
            )}
            <div className="space-y-2">
              {(activityQuery.data ?? []).map((activity) => (
                <div key={activity.id} className="glass flex items-center gap-3 rounded-lg p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary"><Zap className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">{formatActivityDate(activity.completedAt)}</div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="font-semibold text-success">+{activity.xp} XP</div>
                    <div className="text-accent">+{activity.coins} coins</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Update the name and avatar shown throughout CodeQuest.AI.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Display name</Label>
              <Input id="profile-name" value={fullName} onChange={(event) => setFullName(event.target.value)} maxLength={60} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar-url">Avatar image URL (optional)</Label>
              <Input id="avatar-url" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={() => void saveProfile()} disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function createAchievements(level: number, solved: number, streak: number, coins: number, bosses: number): Achievement[] {
  return [
    { id: "first", name: "First Steps", description: "Solve your first coding challenge.", icon: "⚡", unlocked: solved >= 1, progress: `${Math.min(solved, 1)}/1 solved` },
    { id: "solver", name: "Problem Solver", description: "Complete five coding challenges.", icon: "🧩", unlocked: solved >= 5, progress: `${Math.min(solved, 5)}/5 solved` },
    { id: "streak", name: "On Fire", description: "Build a three-day learning streak.", icon: "🔥", unlocked: streak >= 3, progress: `${Math.min(streak, 3)}/3 days` },
    { id: "boss", name: "Boss Slayer", description: "Defeat your first coding boss.", icon: "⚔️", unlocked: bosses >= 1, progress: `${Math.min(bosses, 1)}/1 defeated` },
    { id: "level", name: "Rising Hero", description: "Reach level five.", icon: "🏅", unlocked: level >= 5, progress: `Level ${level}/5` },
    { id: "coins", name: "Treasure Hunter", description: "Collect 500 coins.", icon: "🪙", unlocked: coins >= 500, progress: `${Math.min(coins, 500)}/500 coins` },
  ];
}

function Stat({ icon, label }: { icon: ReactNode; label: string }) {
  return <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5">{icon}<span className="font-medium">{label}</span></div>;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function formatActivityDate(date: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "The profile could not be updated.";
}
