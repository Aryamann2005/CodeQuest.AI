import { supabase } from "./supabase";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  example_input: string;
  example_output: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  xp_reward: number;
  coin_reward: number;
  sort_order: number;
};

export type DailyMission = {
  mission_id: string;
  title: string;
  progress: number;
  total: number;
  xp_reward: number;
  coins_reward: number;
  done: boolean;
  claimed: boolean;
  mission_date: string;
};

export type SkillProgress = {
  skill_id: string;
  name: string;
  topic: string;
  position_x: number;
  position_y: number;
  required_xp: number;
  required_challenges: number;
  show_in_learning_progress: boolean;
  completed_challenges: number;
  total_challenges: number;
  progress_percent: number;
  unlocked: boolean;
  mastered: boolean;
};

export type SkillEdge = {
  parent_skill_id: string;
  child_skill_id: string;
};

export type BossBattle = {
  boss_id: string;
  name: string;
  title: string;
  image: string;
  difficulty: "Easy" | "Medium" | "Hard";
  challenge_id: string;
  challenge_title: string;
  description: string;
  max_hp: number;
  xp_reward: number;
  coin_reward: number;
  item_reward: string;
  defeated: boolean;
  claimed: boolean;
};

export type ProfileActivity = {
  id: string;
  action: string;
  xp: number;
  coins: number;
  completedAt: string;
};

type SkillProgressRow = Omit<SkillProgress, "position_x" | "position_y"> & {
  position_x: number | string;
  position_y: number | string;
};

export const gameProgressKeys = {
  challenges: ["game-progress", "challenges"] as const,
  completedProblems: (userId: string) => ["game-progress", "completed-problems", userId] as const,
  dailyMissions: (userId: string) => ["game-progress", "daily-missions", userId] as const,
  skillProgress: (userId: string) => ["game-progress", "skill-progress", userId] as const,
  skillEdges: ["game-progress", "skill-edges"] as const,
  bossBattles: (userId: string) => ["game-progress", "boss-battles", userId] as const,
  profileActivity: (userId: string) => ["game-progress", "profile-activity", userId] as const,
};

export async function getChallenges() {
  const { data, error } = await supabase
    .from("challenges")
    .select(
      "id, title, description, example_input, example_output, difficulty, topic, xp_reward, coin_reward, sort_order",
    )
    .eq("active", true)
    .order("sort_order");

  if (error) throw error;
  return (data ?? []) as Challenge[];
}

export async function getCompletedProblemIds() {
  const { data, error } = await supabase
    .from("problem_completions")
    .select("problem_id")
    .order("completed_at", { ascending: false });

  if (error) throw error;
  return new Set((data ?? []).map((row) => row.problem_id));
}

export async function completeProblem(problemId: string) {
  const { data, error } = await supabase.rpc("complete_problem", {
    p_problem_id: problemId,
  });

  if (error) throw error;
  return data;
}

export async function getSkillProgress() {
  const { data, error } = await supabase.rpc("get_user_progress");

  if (error) throw error;
  const rows = (data ?? []) as SkillProgressRow[];
  return rows.map((row) => ({
    ...row,
    position_x: Number(row.position_x),
    position_y: Number(row.position_y),
  }));
}

export async function getSkillEdges() {
  const { data, error } = await supabase
    .from("skill_node_edges")
    .select("parent_skill_id, child_skill_id");

  if (error) throw error;
  return (data ?? []) as SkillEdge[];
}

export async function getDailyMissions() {
  const { data, error } = await supabase.rpc("get_daily_missions");

  if (error) throw error;
  return (data ?? []) as DailyMission[];
}

export async function claimDailyMission(missionId: string) {
  const { data, error } = await supabase.rpc("claim_daily_mission", {
    p_mission_id: missionId,
  });

  if (error) throw error;
  return data;
}

export async function getBossBattles() {
  const { data, error } = await supabase.rpc("get_boss_battles");
  if (error) throw error;
  return (data ?? []) as BossBattle[];
}

export async function claimBossReward(bossId: string) {
  const { data, error } = await supabase.rpc("claim_boss_reward", { p_boss_id: bossId });
  if (error) throw error;
  return data;
}

export async function getProfileActivity() {
  const { data, error } = await supabase
    .from("problem_completions")
    .select("id, xp_earned, coins_earned, completed_at, challenges(title)")
    .order("completed_at", { ascending: false })
    .limit(30);
  if (error) throw error;

  return (data ?? []).map((row) => {
    const challenge = row.challenges as unknown as { title?: string } | null;
    return {
      id: row.id,
      action: `Solved ${challenge?.title ?? `challenge ${row.id}`}`,
      xp: row.xp_earned,
      coins: row.coins_earned,
      completedAt: row.completed_at,
    } satisfies ProfileActivity;
  });
}
