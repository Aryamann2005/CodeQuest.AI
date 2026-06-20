import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles, Swords, Brain, GitBranch, Trophy, Code2, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { features, pricingPlans, testimonials } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeQuest AI — Level Up Your Coding Journey" },
      { name: "description", content: "Gamified coding learning platform. Defeat bosses, gain XP, and master DSA with an AI mentor." },
      { property: "og:title", content: "CodeQuest AI — Level Up Your Coding Journey" },
      { property: "og:description", content: "Learn Coding. Defeat Bosses. Gain XP. Master Skills." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <CodingGaming />
      <MentorSection />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex h-16 items-center gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-lg gradient-hero-bg grid place-items-center font-bold text-white text-sm">CQ</div>
          <span className="font-bold text-lg hidden xs:inline">CodeQuest<span className="text-accent">.AI</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 ml-8 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a>
          <a href="#how" className="text-muted-foreground hover:text-foreground transition">How it works</a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition">Pricing</a>
          <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition">Reviews</a>
        </nav>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link to="/login"><Button variant="ghost" size="sm" className="px-2.5 sm:px-3">Log in</Button></Link>
          <Link to="/register"><Button size="sm" className="gradient-primary-bg border-0 shadow-[var(--shadow-glow)]">Get Started</Button></Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-20 lg:pt-28 pb-20 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-6 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>AI-powered coding RPG · Now in open beta</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <span className="gradient-text">Level Up</span><br />Your Coding Journey
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Learn Coding. Defeat Bosses. Gain XP. Master Skills. The first platform where DSA practice feels like an epic RPG.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/register"><Button size="lg" className="gradient-primary-bg border-0 shadow-[var(--shadow-glow)] h-12 px-7">
              Start Your Quest <ArrowRight className="ml-2 h-4 w-4" />
            </Button></Link>
            <Link to="/dashboard"><Button size="lg" variant="outline" className="h-12 px-7 glass">
              Live Demo
            </Button></Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> No credit card</div>
            <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> 500+ curated problems</div>
            <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-success" /> Free forever tier</div>
          </div>
        </div>

        {/* Hero showcase mockup */}
        <div className="mt-16 relative max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: "0.5s" }}>
          <div className="absolute -inset-1 gradient-hero-bg rounded-2xl blur-2xl opacity-30" />
          <div className="relative glass-strong rounded-2xl p-2 shadow-[var(--shadow-elevated)]">
            <div className="rounded-xl overflow-hidden bg-background/80 grid grid-cols-1 md:grid-cols-5 gap-2 p-3">
              <div className="md:col-span-3 bg-[#0a0f1e] rounded-lg p-4 font-mono text-xs space-y-1">
                <div className="flex gap-1.5 mb-2"><span className="h-2.5 w-2.5 rounded-full bg-destructive/70" /><span className="h-2.5 w-2.5 rounded-full bg-warning/70" /><span className="h-2.5 w-2.5 rounded-full bg-success/70" /></div>
                <div><span className="text-primary">function</span> <span className="text-accent">twoSum</span>(nums, target) {"{"}</div>
                <div className="pl-4"><span className="text-primary">const</span> map = <span className="text-primary">new</span> Map();</div>
                <div className="pl-4"><span className="text-primary">for</span> (<span className="text-primary">let</span> i = 0; i {"<"} nums.length; i++) {"{"}</div>
                <div className="pl-8"><span className="text-primary">const</span> diff = target - nums[i];</div>
                <div className="pl-8"><span className="text-primary">if</span> (map.has(diff)) <span className="text-primary">return</span> [map.get(diff), i];</div>
                <div className="pl-8">map.set(nums[i], i);</div>
                <div className="pl-4">{"}"}</div>
                <div>{"}"}</div>
                <div className="mt-3 text-success">✓ Accepted · Runtime 64ms · +120 XP</div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Current Boss</div>
                  <div className="font-bold mt-1 flex items-center gap-2">🐉 Graph Dragon</div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full gradient-hero-bg" style={{ width: "28%" }} /></div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Daily Streak</div>
                  <div className="font-bold text-2xl mt-1 text-warning">🔥 12 days</div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Next Level</div>
                  <div className="font-bold mt-1">Lv 24 → 25</div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full gradient-hero-bg" style={{ width: "80%" }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-24 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Features" title="Everything you need to dominate" subtitle="A complete RPG-style learning experience built for developers who hate boring grinds." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {features.map((f, i) => (
            <Card key={f.title} className="glass-strong p-6 border-border/50 hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", icon: Code2, title: "Pick your quest", desc: "Choose from curated problem sets, skill trees, or jump into a boss battle." },
    { n: "02", icon: Zap, title: "Solve & submit", desc: "Code in our editor, run test cases, and get instant feedback with XP rewards." },
    { n: "03", icon: Brain, title: "Learn with AI", desc: "Stuck? Your AI mentor explains, hints, and reviews — never just gives answers." },
    { n: "04", icon: Trophy, title: "Climb & flex", desc: "Level up, unlock titles, top leaderboards. Your progress becomes your portfolio." },
  ];
  return (
    <section id="how" className="py-24 px-4 lg:px-8 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="How it works" title="From novice to legendary" subtitle="Four steps, infinite progress." />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="glass-strong rounded-2xl p-6 h-full">
                <div className="font-mono text-xs text-accent">{s.n}</div>
                <s.icon className="h-8 w-8 text-primary mt-3" />
                <h3 className="font-semibold mt-4">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              </div>
              {i < steps.length - 1 && <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-border" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CodingGaming() {
  return (
    <section className="py-24 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs font-mono text-accent uppercase tracking-wider">Coding × Gaming</div>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">Where DSA meets <span className="gradient-text">epic loot</span></h2>
          <p className="mt-4 text-lg text-muted-foreground">Every problem solved chips away at a boss. Every boss defeated unlocks rare titles. Every level earned brings you closer to becoming a Legendary Developer.</p>
          <ul className="mt-6 space-y-3">
            {["Boss HP scales with problem difficulty","Critical hits for optimal solutions","Combo multipliers for daily streaks","Loot drops: titles, themes, cosmetics"].map(t => (
              <li key={t} className="flex items-start gap-3"><div className="mt-1 h-5 w-5 rounded-full gradient-primary-bg grid place-items-center"><Check className="h-3 w-3 text-white" /></div><span>{t}</span></li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 gradient-hero-bg rounded-3xl blur-3xl opacity-25" />
          <div className="relative glass-strong rounded-2xl p-6">
            <div className="text-center text-7xl mb-4 animate-float">🐉</div>
            <div className="text-center font-bold text-xl">Graph Dragon</div>
            <div className="text-center text-xs text-muted-foreground">Master of Connected Realms</div>
            <div className="mt-5 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span>HP</span><span className="font-mono">720 / 1000</span></div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-to-r from-destructive to-warning" style={{ width: "72%" }} /></div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="glass rounded-lg p-3"><div className="text-xs text-muted-foreground">XP</div><div className="font-bold text-success">+2500</div></div>
                <div className="glass rounded-lg p-3"><div className="text-xs text-muted-foreground">Coins</div><div className="font-bold text-accent">+800</div></div>
                <div className="glass rounded-lg p-3"><div className="text-xs text-muted-foreground">Drop</div><div className="font-bold text-warning">👑</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MentorSection() {
  return (
    <section className="py-24 px-4 lg:px-8 bg-surface/30">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1 relative">
          <div className="glass-strong rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-muted grid place-items-center text-xs font-bold">U</div>
              <div className="flex-1 glass rounded-2xl rounded-tl-sm p-3 text-sm">Why does my BFS solution TLE on large graphs?</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full gradient-primary-bg grid place-items-center shrink-0"><Brain className="h-4 w-4 text-white" /></div>
              <div className="flex-1 rounded-2xl rounded-tl-sm p-3 text-sm border border-primary/30 bg-primary/10">
                Likely your queue uses <code className="font-mono text-accent">array.shift()</code> which is O(n). Switch to a deque or index pointer. Want me to walk through the optimized version?
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-muted grid place-items-center text-xs font-bold">U</div>
              <div className="flex-1 glass rounded-2xl rounded-tl-sm p-3 text-sm">Yes please, but only the key change.</div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="text-xs font-mono text-accent uppercase tracking-wider">AI Mentor</div>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">A coach that <span className="gradient-text">teaches</span>, not solves</h2>
          <p className="mt-4 text-lg text-muted-foreground">Powered by Gemini-class models, your AI mentor gives Socratic hints, explains tradeoffs, and reviews your code line-by-line — without spoiling the answer.</p>
          <Link to="/mentor"><Button className="mt-6 gradient-primary-bg border-0">Meet your mentor <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Pricing" title="Choose your path" subtitle="Start free. Upgrade when you're ready to grind for real." />
        <div className="grid md:grid-cols-3 gap-5 mt-14 max-w-5xl mx-auto">
          {pricingPlans.map(p => (
            <Card key={p.name} className={cn("p-7 relative", p.popular ? "glass-strong border-primary/50 shadow-[var(--shadow-glow)] md:scale-105" : "glass border-border/50")}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold gradient-primary-bg text-primary-foreground">Most Popular</div>}
              <div className="font-semibold">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                {p.period && <span className="text-sm text-muted-foreground">{p.period}</span>}
              </div>
              <div className="text-sm text-muted-foreground mt-2">{p.desc}</div>
              <ul className="mt-6 space-y-2.5">
                {p.features.map(f => <li key={f} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-success mt-0.5 shrink-0" /><span>{f}</span></li>)}
              </ul>
              <Link to="/register" className="block mt-7"><Button className={cn("w-full", p.popular ? "gradient-primary-bg border-0" : "")} variant={p.popular ? "default" : "outline"}>{p.cta}</Button></Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 lg:px-8 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow="Testimonials" title="Loved by 50,000+ coders" subtitle="From CS students to FAANG engineers." />
        <div className="grid md:grid-cols-3 gap-5 mt-14">
          {testimonials.map(t => (
            <Card key={t.name} className="glass-strong p-6 border-border/50">
              <div className="flex gap-0.5 text-warning">{[...Array(5)].map((_,i)=><Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <Avatar><AvatarImage src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${t.avatar}`} /><AvatarFallback>{t.name[0]}</AvatarFallback></Avatar>
                <div><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-4 lg:px-8">
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute -inset-2 gradient-hero-bg rounded-3xl blur-3xl opacity-30" />
        <div className="relative glass-strong rounded-3xl p-12 lg:p-16 text-center border-primary/30">
          <h2 className="text-4xl md:text-5xl font-bold">Your quest awaits.<br /><span className="gradient-text">Start swinging the sword.</span></h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Join 50,000+ devs leveling up their craft, one boss battle at a time.</p>
          <Link to="/register"><Button size="lg" className="mt-8 gradient-primary-bg border-0 shadow-[var(--shadow-glow)] h-12 px-8">Begin Free Quest <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-hero-bg grid place-items-center font-bold text-white text-sm">CQ</div>
            <span className="font-bold">CodeQuest.AI</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">Where coding meets RPG. Built by devs, for devs.</p>
        </div>
        {[
          { title: "Product", links: ["Features", "Pricing", "Roadmap", "Changelog"] },
          { title: "Community", links: ["Discord", "Twitter", "GitHub", "Leaderboard"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
        ].map(col => (
          <div key={col.title}>
            <div className="font-semibold text-sm">{col.title}</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{col.links.map(l => <li key={l}><a href="#" className="hover:text-foreground">{l}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-border/50 text-xs text-muted-foreground flex justify-between flex-wrap gap-2">
        <div>© 2026 CodeQuest AI. All rights reserved.</div>
        <div>Made with ⚔️ for coders</div>
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="text-xs font-mono text-accent uppercase tracking-wider">{eyebrow}</div>
      <h2 className="text-4xl md:text-5xl font-bold mt-2">{title}</h2>
      <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
    </div>
  );
}
