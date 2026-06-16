import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { problems } from "@/lib/mock-data";
import { Search, Play, Send, Sparkles, Check, X, Terminal, FileCode } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/arena")({ component: Arena });

function Arena() {
  const [selected, setSelected] = useState(problems[5]);
  const [diff, setDiff] = useState("all");
  const [topic, setTopic] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = problems.filter(p =>
    (diff === "all" || p.difficulty.toLowerCase() === diff) &&
    (topic === "all" || p.topic === topic) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Coding Arena</h1>
        <p className="text-muted-foreground mt-1">Pick a problem. Earn XP. Climb the ranks.</p>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* Problem list */}
        <Card className="glass-strong border-border/50 p-4 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
          <div className="space-y-3 sticky top-0 bg-card/50 backdrop-blur pb-3 z-10">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search problems..." className="pl-9" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={diff} onValueChange={setDiff}>
                <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent>
              </Select>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger><SelectValue placeholder="Topic" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {[...new Set(problems.map(p=>p.topic))].map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            {filtered.map(p => (
              <button key={p.id} onClick={() => setSelected(p)}
                className={`w-full text-left glass rounded-lg p-3 hover:bg-sidebar-accent transition ${selected.id === p.id ? "ring-2 ring-primary" : ""}`}>
                <div className="flex items-center gap-2">
                  {p.solved ? <Check className="h-4 w-4 text-success shrink-0" /> : <span className="h-4 w-4 rounded-full border border-border shrink-0" />}
                  <span className="font-medium text-sm truncate flex-1">{p.id}. {p.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <DifficultyBadge d={p.difficulty} />
                  <span className="text-muted-foreground">{p.topic}</span>
                  <span className="ml-auto text-muted-foreground tabular-nums">{p.acceptance}%</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-sm text-muted-foreground">
                <FileCode className="h-10 w-10 mx-auto mb-2 opacity-50" />
                No problems match these filters.
              </div>
            )}
          </div>
        </Card>

        {/* Editor + problem */}
        <div className="space-y-4">
          <Card className="glass-strong border-border/50 p-6">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2"><DifficultyBadge d={selected.difficulty} /><span className="text-xs text-muted-foreground">{selected.topic} · {selected.acceptance}% acceptance</span></div>
                <h2 className="text-xl font-bold mt-2">{selected.id}. {selected.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Reward</span>
                <span className="px-2.5 py-1 rounded-md bg-primary/15 text-primary border border-primary/30 text-xs font-semibold">+{selected.xp} XP</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Given an array of integers, return indices of the two numbers such that they add up to a specific target. You may assume each input has exactly one solution, and you may not use the same element twice.
            </p>
            <div className="mt-4 glass rounded-lg p-3 font-mono text-xs">
              <div className="text-muted-foreground">Example:</div>
              <div>Input: nums = [2,7,11,15], target = 9</div>
              <div>Output: [0,1]</div>
            </div>
          </Card>

          <Card className="glass-strong border-border/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-background/40">
              <FileCode className="h-4 w-4 text-accent" />
              <span className="font-mono text-xs">solution.js</span>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 gap-1.5"><Sparkles className="h-3.5 w-3.5 text-accent" /> AI Hint</Button>
              </div>
            </div>
            <div className="bg-[#0a0f1e] font-mono text-xs p-4 min-h-[280px] space-y-1">
              <div><span className="text-primary">function</span> <span className="text-accent">twoSum</span>(nums, target) {"{"}</div>
              <div className="pl-4 text-muted-foreground">{"// Your solution here"}</div>
              <div className="pl-4"><span className="text-primary">const</span> map = <span className="text-primary">new</span> Map();</div>
              <div className="pl-4"><span className="text-primary">for</span> (<span className="text-primary">let</span> i = 0; i {"<"} nums.length; i++) {"{"}</div>
              <div className="pl-8"><span className="text-primary">const</span> diff = target - nums[i];</div>
              <div className="pl-8"><span className="text-primary">if</span> (map.has(diff)) <span className="text-primary">return</span> [map.get(diff), i];</div>
              <div className="pl-8">map.set(nums[i], i);</div>
              <div className="pl-4">{"}"}</div>
              <div>{"}"}</div>
            </div>
          </Card>

          <Card className="glass-strong border-border/50 p-4">
            <Tabs defaultValue="testcases">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <TabsList>
                  <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toast.success("All test cases passed!")}><Play className="h-4 w-4 mr-1.5" /> Run</Button>
                  <Button className="gradient-primary-bg border-0" onClick={() => toast.success("Accepted! +" + selected.xp + " XP")}><Send className="h-4 w-4 mr-1.5" /> Submit</Button>
                </div>
              </div>
              <TabsContent value="testcases" className="mt-4 space-y-2">
                {[
                  { i: "[2,7,11,15], 9", o: "[0,1]", pass: true },
                  { i: "[3,2,4], 6", o: "[1,2]", pass: true },
                  { i: "[3,3], 6", o: "[0,1]", pass: true },
                ].map((tc, i) => (
                  <div key={i} className="glass rounded-lg p-3 flex items-center gap-3 text-sm">
                    {tc.pass ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}
                    <div className="font-mono flex-1"><span className="text-muted-foreground">Input:</span> {tc.i} · <span className="text-muted-foreground">Output:</span> {tc.o}</div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="output" className="mt-4">
                <div className="font-mono text-xs bg-[#0a0f1e] rounded-lg p-4 flex items-start gap-2"><Terminal className="h-4 w-4 text-success mt-0.5" /><div><div className="text-success">✓ All test cases passed</div><div className="text-muted-foreground mt-1">Runtime: 64 ms · Memory: 41.2 MB</div></div></div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
