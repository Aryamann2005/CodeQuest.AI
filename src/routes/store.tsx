import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { storeItems } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { Coins, Check, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/store")({ component: Store });

function Store() {
  const { profile } = useAuth();
  if (!profile) return null;

  return (
    <AppLayout>
      <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Store</h1>
          <p className="text-muted-foreground mt-1">Spend coins on themes, cosmetics & premium plans.</p>
        </div>
        <div className="glass-strong rounded-xl px-4 py-2 flex items-center gap-2 border border-accent/30"><Coins className="h-4 w-4 text-accent" /><span className="font-semibold tabular-nums">{profile.coins.toLocaleString()}</span><span className="text-xs text-muted-foreground">coins</span></div>
      </div>

      <Tabs defaultValue="themes">
        <TabsList className="glass"><TabsTrigger value="themes">Themes</TabsTrigger><TabsTrigger value="avatars">Avatars</TabsTrigger><TabsTrigger value="cosmetics">Cosmetics</TabsTrigger><TabsTrigger value="premium">Premium</TabsTrigger></TabsList>

        <TabsContent value="themes" className="mt-6"><Grid items={storeItems.themes} coins={profile.coins} /></TabsContent>
        <TabsContent value="avatars" className="mt-6"><Grid items={storeItems.avatars} coins={profile.coins} /></TabsContent>
        <TabsContent value="cosmetics" className="mt-6"><Grid items={storeItems.cosmetics} coins={profile.coins} /></TabsContent>

        <TabsContent value="premium" className="mt-6">
          <div className="grid md:grid-cols-3 gap-5">
            {storeItems.plans.map(p => (
              <Card key={p.id} className={cn("p-6 relative", p.popular ? "glass-strong border-primary/50 shadow-[var(--shadow-glow)] md:scale-105" : "glass border-border/50")}>
                {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold gradient-primary-bg text-primary-foreground flex items-center gap-1"><Crown className="h-3 w-3" /> Most Popular</div>}
                <div className="font-semibold text-lg">{p.name}</div>
                <div className="text-3xl font-bold mt-2 gradient-text">{p.price}</div>
                <ul className="mt-5 space-y-2">{p.perks.map(perk => <li key={perk} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" />{perk}</li>)}</ul>
                <Button className={cn("w-full mt-6", p.popular ? "gradient-primary-bg border-0" : "")} variant={p.popular ? "default" : "outline"}>Upgrade</Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}

function Grid({ items, coins }: { items: any[]; coins: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(i => (
        <Card key={i.id} className="glass-strong border-border/50 p-5 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)] transition-all">
          <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 grid place-items-center text-7xl border border-border/50">{i.image}</div>
          <div className="mt-4 font-semibold">{i.name}</div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-semibold"><Coins className="h-4 w-4 text-accent" /> {i.price}</div>
            {i.owned
              ? <span className="text-xs text-success font-semibold flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Owned</span>
              : <Button
                  size="sm"
                  className="gradient-primary-bg border-0"
                  disabled={coins < i.price}
                  onClick={() => toast.info("Store purchases are not enabled yet. Your coins were not charged.")}
                >
                  {coins < i.price ? "Need more" : "Buy"}
                </Button>}
          </div>
        </Card>
      ))}
    </div>
  );
}
