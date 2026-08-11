import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DifficultyBadge } from "@/components/difficulty-badge";
import { useAuth } from "@/lib/auth-context";
import {
  completeProblem,
  gameProgressKeys,
  getChallenges,
  getCompletedProblemIds,
} from "@/lib/game-progress";
import {
  createStarterCode,
  getChallengeTests,
  runCode,
  type CodeLanguage,
  type RunResult,
} from "@/lib/code-runner";
import { Search, Play, Send, Sparkles, Check, X, Terminal, FileCode } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/arena")({ component: Arena });

function Arena() {
  const { user, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [diff, setDiff] = useState("all");
  const [topic, setTopic] = useState("all");
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [language, setLanguage] = useState<CodeLanguage>("javascript");
  const [solutions, setSolutions] = useState<Record<string, string>>({});
  const [runState, setRunState] = useState<{ challengeId: string; result: RunResult } | null>(null);
  const [activeTab, setActiveTab] = useState("testcases");

  const challengesQuery = useQuery({
    queryKey: gameProgressKeys.challenges,
    queryFn: getChallenges,
    enabled: Boolean(user),
  });
  const completedProblemsQuery = useQuery({
    queryKey: gameProgressKeys.completedProblems(user?.id ?? "anonymous"),
    queryFn: getCompletedProblemIds,
    enabled: Boolean(user),
  });

  const problems = challengesQuery.data ?? [];
  const completedProblemIds = completedProblemsQuery.data ?? new Set<string>();
  const selected = problems.find((problem) => problem.id === selectedId) ?? problems[0];
  const solutionKey = selected ? `${language}:${selected.id}` : "";
  const code = selected
    ? (solutions[solutionKey] ?? createStarterCode(selected.title, language, selected.id))
    : "";
  const tests = selected ? getChallengeTests(selected.id) : [];
  const currentRun = selected && runState?.challengeId === selected.id ? runState.result : null;
  const filtered = problems.filter(
    (problem) =>
      (diff === "all" || problem.difficulty.toLowerCase() === diff) &&
      (topic === "all" || problem.topic === topic) &&
      problem.title.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleRun() {
    if (!selected) return null;

    setRunning(true);
    setActiveTab("output");
    try {
      const result = await runCode(language, selected.id, code, tests);
      setRunState({ challengeId: selected.id, result });
      if (result.passed) toast.success(`All ${result.results.length} test cases passed!`);
      else toast.error("Some test cases failed. Check the output below.");
      return result;
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    if (!selected || !user) return;

    if (completedProblemIds.has(selected.id)) {
      toast.info("Already solved. XP was already claimed for this challenge.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await runCode(language, selected.id, code, tests);
      setRunState({ challengeId: selected.id, result });
      setActiveTab("output");
      if (!result.passed) {
        toast.error("Submission rejected. Pass every test case before earning XP.");
        return;
      }

      await completeProblem(selected.id);
      queryClient.setQueryData<Set<string>>(
        gameProgressKeys.completedProblems(user.id),
        (current) => new Set(current ?? []).add(selected.id),
      );
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: gameProgressKeys.completedProblems(user.id),
        }),
        queryClient.invalidateQueries({
          queryKey: gameProgressKeys.skillProgress(user.id),
        }),
        queryClient.invalidateQueries({
          queryKey: gameProgressKeys.dailyMissions(user.id),
        }),
        refreshProfile(),
      ]);
      toast.success(`Accepted! +${selected.xp_reward} XP saved to your profile.`);
    } catch (error: unknown) {
      console.error("Unable to submit challenge", error);
      toast.error(error instanceof Error ? error.message : "Could not save XP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (challengesQuery.isLoading || completedProblemsQuery.isLoading) {
    return (
      <AppLayout>
        <Card className="glass-strong border-border/50 p-6 text-sm text-muted-foreground">
          Loading challenges and your saved progress...
        </Card>
      </AppLayout>
    );
  }

  if (challengesQuery.error || completedProblemsQuery.error || !selected) {
    return (
      <AppLayout>
        <Card className="glass-strong border-border/50 p-6">
          <h1 className="text-xl font-semibold">Challenges unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The challenge catalog or your saved completions could not be loaded.
          </p>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">Coding Arena</h1>
        <p className="text-muted-foreground mt-1">Pick a problem. Earn XP. Climb the ranks.</p>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        <Card className="glass-strong border-border/50 p-4 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
          <div className="space-y-3 sticky top-0 bg-card/50 backdrop-blur pb-3 z-10">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search problems..."
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={diff} onValueChange={setDiff}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {[...new Set(problems.map((problem) => problem.topic))].map((problemTopic) => (
                    <SelectItem key={problemTopic} value={problemTopic}>
                      {problemTopic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            {filtered.map((problem) => (
              <button
                key={problem.id}
                onClick={() => setSelectedId(problem.id)}
                className={`w-full text-left glass rounded-lg p-3 hover:bg-sidebar-accent transition ${
                  selected.id === problem.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {completedProblemIds.has(problem.id) ? (
                    <Check className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-border shrink-0" />
                  )}
                  <span className="font-medium text-sm truncate flex-1">
                    {problem.id}. {problem.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <DifficultyBadge d={problem.difficulty} />
                  <span className="text-muted-foreground">{problem.topic}</span>
                  <span className="ml-auto text-muted-foreground tabular-nums">
                    +{problem.xp_reward} XP
                  </span>
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

        <div className="space-y-4">
          <Card className="glass-strong border-border/50 p-6">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <DifficultyBadge d={selected.difficulty} />
                  <span className="text-xs text-muted-foreground">{selected.topic}</span>
                </div>
                <h2 className="text-xl font-bold mt-2">
                  {selected.id}. {selected.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Reward</span>
                <span className="px-2.5 py-1 rounded-md bg-primary/15 text-primary border border-primary/30 text-xs font-semibold">
                  +{selected.xp_reward} XP
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {selected.description}
            </p>
            <div className="mt-4 glass rounded-lg p-3 font-mono text-xs">
              <div className="text-muted-foreground">Example:</div>
              <div>Input: {selected.example_input}</div>
              <div>Output: {selected.example_output}</div>
            </div>
          </Card>

          <Card className="glass-strong border-border/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 bg-background/40">
              <FileCode className="h-4 w-4 text-accent" />
              <span className="font-mono text-xs">
                solution.{language === "javascript" ? "js" : language === "python" ? "py" : "cpp"}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <Select
                  value={language}
                  onValueChange={(value) => {
                    setLanguage(value as CodeLanguage);
                    setRunState(null);
                    setActiveTab("testcases");
                  }}
                >
                  <SelectTrigger className="h-8 w-[130px] font-mono text-xs" aria-label="Language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" className="h-8 gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-accent" /> AI Hint
                </Button>
              </div>
            </div>
            <Textarea
              value={code}
              onChange={(event) => {
                setSolutions((current) => ({ ...current, [solutionKey]: event.target.value }));
                setRunState(null);
              }}
              spellCheck={false}
              aria-label={`JavaScript solution for ${selected.title}`}
              className="min-h-[320px] resize-y rounded-none border-0 bg-[#0a0f1e] p-4 font-mono text-sm leading-6 text-slate-100 focus-visible:ring-0"
            />
          </Card>

          <Card className="glass-strong border-border/50 p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <TabsList>
                  <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => void handleRun()} disabled={running || submitting}>
                    <Play className="h-4 w-4 mr-1.5" /> {running ? "Running..." : "Run"}
                  </Button>
                  <Button
                    className="gradient-primary-bg border-0"
                    onClick={handleSubmit}
                    disabled={submitting || running || completedProblemIds.has(selected.id)}
                  >
                    <Send className="h-4 w-4 mr-1.5" />
                    {submitting
                      ? "Saving..."
                      : completedProblemIds.has(selected.id)
                        ? "Solved"
                        : "Submit"}
                  </Button>
                </div>
              </div>
              <TabsContent value="testcases" className="mt-4 space-y-2">
                {tests.map((test, index) => (
                  <div key={index} className="glass rounded-lg p-3 text-sm">
                    <div className="mb-1 text-xs font-medium text-muted-foreground">
                      Test case {index + 1}
                    </div>
                    <div className="break-all font-mono text-xs">
                      <span className="text-muted-foreground">Input:</span> {formatValue(test.input)}
                      {" | "}
                      <span className="text-muted-foreground">Expected:</span>{" "}
                      {formatValue(test.expected)}
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="output" className="mt-4">
                {!currentRun ? (
                  <div className="font-mono text-xs bg-[#0a0f1e] rounded-lg p-4 flex items-start gap-2 text-muted-foreground">
                    <Terminal className="h-4 w-4 mt-0.5" /> Run your code to see the result.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentRun.results.map((result, index) => (
                      <div
                        key={index}
                        className="font-mono text-xs bg-[#0a0f1e] rounded-lg p-4 flex items-start gap-2"
                      >
                        {result.passed ? (
                          <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                        )}
                        <div className="min-w-0 break-all">
                          <div className={result.passed ? "text-success" : "text-destructive"}>
                            Test {index + 1}: {result.passed ? "Passed" : "Failed"}
                          </div>
                          {result.error ? (
                            <div className="mt-1 text-destructive">{result.error}</div>
                          ) : (
                            <div className="mt-1 text-muted-foreground">
                              Expected {formatValue(result.expected)} · Received {formatValue(result.actual)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function formatValue(value: unknown) {
  if (value === undefined) return "undefined";
  if (typeof value === "string") return JSON.stringify(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
