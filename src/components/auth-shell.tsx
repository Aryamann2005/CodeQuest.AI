import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden grid-bg items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        <div className="relative max-w-md text-center">
          <div className="text-7xl mb-6 animate-float">⚔️</div>
          <h2 className="text-3xl font-bold gradient-text">Your quest awaits</h2>
          <p className="mt-4 text-muted-foreground">Join 50,000+ developers leveling up their craft through epic boss battles, skill trees, and an AI mentor that actually teaches.</p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
            <div className="glass rounded-xl p-3"><div className="text-2xl">🏆</div><div className="mt-1 font-semibold">500+ Problems</div></div>
            <div className="glass rounded-xl p-3"><div className="text-2xl">🐉</div><div className="mt-1 font-semibold">25 Bosses</div></div>
            <div className="glass rounded-xl p-3"><div className="text-2xl">🧠</div><div className="mt-1 font-semibold">AI Mentor</div></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-lg gradient-hero-bg grid place-items-center font-bold text-white">CQ</div>
            <span className="font-bold text-lg">CodeQuest<span className="text-accent">.AI</span></span>
          </Link>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-sm text-muted-foreground text-center">{footer}</div>
        </div>
      </div>
    </div>
  );
}
