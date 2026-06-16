import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiConversations, suggestedQuestions } from "@/lib/mock-data";
import { Brain, Send, Plus, Sparkles, BookOpen, MessageSquare, User } from "lucide-react";

export const Route = createFileRoute("/mentor")({ component: Mentor });

type Msg = { role: "user" | "ai"; text: string };

function Mentor() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hey hero! I'm your AI Mentor. Ask me anything about algorithms, data structures, or paste code for a review. I'll guide you — not just hand over solutions." },
  ]);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: "Great question. Let's think about this in three steps:\n\n1. **Identify the pattern** — this looks like a classic sliding-window problem.\n2. **Define the window** — what are you tracking inside it?\n3. **Update on each step** — shrink/grow based on a condition.\n\nWant me to walk through a concrete example, or would you prefer to try drafting an approach first?" }]);
    }, 600);
  }

  return (
    <AppLayout>
      <div className="grid lg:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-8rem)]">
        {/* Sidebar */}
        <Card className="glass-strong border-border/50 p-4 flex flex-col">
          <Button className="gradient-primary-bg border-0 w-full"><Plus className="h-4 w-4 mr-2" /> New Chat</Button>
          <div className="mt-5 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">History</div>
          <ScrollArea className="flex-1 -mx-2">
            <div className="px-2 space-y-1">
              {aiConversations.map(c => (
                <button key={c.id} className="w-full text-left p-2.5 rounded-lg hover:bg-sidebar-accent transition">
                  <div className="flex items-start gap-2"><MessageSquare className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" /><div className="min-w-0"><div className="text-sm truncate">{c.title}</div><div className="text-xs text-muted-foreground">{c.time}</div></div></div>
                </button>
              ))}
            </div>
          </ScrollArea>
          <Card className="glass p-3 mt-4 border-border/50">
            <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-accent" /><div className="text-xs font-semibold">Coding Explanations</div></div>
            <div className="mt-2 space-y-1.5 text-xs">
              {["Big-O Cheatsheet", "DP Patterns", "Graph Algorithms", "Recursion Tree"].map(t => <a key={t} href="#" className="block text-muted-foreground hover:text-foreground transition">→ {t}</a>)}
            </div>
          </Card>
        </Card>

        {/* Chat */}
        <Card className="glass-strong border-border/50 flex flex-col overflow-hidden">
          <div className="border-b border-border/50 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-primary-bg grid place-items-center shadow-[var(--shadow-glow)]"><Brain className="h-5 w-5 text-white" /></div>
            <div><div className="font-semibold">CodeQuest AI Mentor</div><div className="text-xs text-success flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Online · GPT-class · Free during beta</div></div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-8 w-8 rounded-full shrink-0 grid place-items-center ${m.role === "user" ? "bg-muted" : "gradient-primary-bg"}`}>
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4 text-white" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-3.5 text-sm whitespace-pre-line ${m.role === "user" ? "bg-primary/20 border border-primary/30 rounded-tr-sm" : "glass rounded-tl-sm"}`}>{m.text}</div>
                </div>
              ))}

              {messages.length === 1 && (
                <div className="pt-4">
                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Suggested questions</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {suggestedQuestions.map(q => (
                      <button key={q} onClick={() => send(q)} className="text-left glass rounded-xl p-3 text-sm hover:bg-sidebar-accent transition flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-accent mt-0.5 shrink-0" /><span>{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border/50 p-4">
            <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2 max-w-3xl mx-auto">
              <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask your mentor anything..." className="h-11" />
              <Button type="submit" className="gradient-primary-bg border-0 h-11 px-5"><Send className="h-4 w-4" /></Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-2 max-w-3xl mx-auto">AI may make mistakes. Verify critical answers.</p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
