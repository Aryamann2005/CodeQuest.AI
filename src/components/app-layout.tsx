import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  LayoutDashboard, Swords, Brain, Skull, GitBranch, Trophy, User, Store, Flame, Coins, Bell, Menu,
} from "lucide-react";
import { user } from "@/lib/mock-data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/arena", label: "Coding Arena", icon: Swords },
  { to: "/mentor", label: "AI Mentor", icon: Brain },
  { to: "/boss", label: "Boss Battles", icon: Skull },
  { to: "/skill-tree", label: "Skill Tree", icon: GitBranch },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/store", label: "Store", icon: Store },
];

function SidebarBody({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2 px-6 py-5 border-b border-border/50">
        <div className="h-9 w-9 rounded-lg gradient-hero-bg grid place-items-center font-bold text-white shadow-[var(--shadow-glow)]">CQ</div>
        <div className="font-bold text-lg tracking-tight">CodeQuest<span className="text-accent">.AI</span></div>
      </Link>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(item => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link key={item.to} to={item.to} onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                active
                  ? "gradient-primary-bg text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}>
              <item.icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border/50">
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/40">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">Lv {user.level} · {user.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex w-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border/50 bg-sidebar/60 backdrop-blur-xl flex-col sticky top-0 h-screen">
        <SidebarBody pathname={pathname} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border/50">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden"><Menu /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-sidebar">
                <SidebarBody pathname={pathname} />
              </SheetContent>
            </Sheet>

            <div className="flex-1" />

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/15 border border-warning/30" title="Daily streak">
              <Flame className="h-4 w-4 text-warning" />
              <span className="text-sm font-semibold tabular-nums">{user.streak}</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30" title="Coins">
              <Coins className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold tabular-nums">{user.coins.toLocaleString()}</span>
            </div>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 animate-fade-up">{children}</main>
      </div>
    </div>
  );
}
