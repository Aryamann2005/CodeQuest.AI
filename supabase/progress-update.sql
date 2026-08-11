-- Migration for an existing CodeQuest.AI Supabase project.
-- Run this entire file after the original auth/progress setup.

revoke update on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;

create table if not exists public.challenges (
  id text primary key,
  title text not null,
  description text not null,
  example_input text not null,
  example_output text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  topic text not null,
  xp_reward integer not null check (xp_reward >= 0),
  coin_reward integer not null check (coin_reward >= 0),
  sort_order integer not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.challenges enable row level security;

drop policy if exists "Authenticated users can view active challenges" on public.challenges;
create policy "Authenticated users can view active challenges"
on public.challenges for select
to authenticated
using (active);

insert into public.challenges (
  id,
  title,
  description,
  example_input,
  example_output,
  difficulty,
  topic,
  xp_reward,
  coin_reward,
  sort_order
)
values
  ('1', 'Two Sum', 'Return the indices of two values whose sum equals the target.', 'nums = [2,7,11,15], target = 9', '[0,1]', 'Easy', 'Arrays', 50, 10, 1),
  ('2', 'Valid Parentheses', 'Determine whether every bracket in the input string is closed in the correct order.', 's = "()[]{}"', 'true', 'Easy', 'Stack', 50, 10, 2),
  ('3', 'Merge Two Sorted Lists', 'Merge two sorted linked lists into one sorted linked list.', 'list1 = [1,2,4], list2 = [1,3,4]', '[1,1,2,3,4,4]', 'Easy', 'Linked List', 60, 12, 3),
  ('4', 'Longest Substring Without Repeating', 'Find the length of the longest substring containing no repeated characters.', 's = "abcabcbb"', '3', 'Medium', 'Strings', 120, 24, 4),
  ('5', 'Add Two Numbers', 'Add two numbers represented by reversed linked lists and return the sum as a linked list.', 'l1 = [2,4,3], l2 = [5,6,4]', '[7,0,8]', 'Medium', 'Linked List', 120, 24, 5),
  ('6', '3Sum', 'Return all unique triplets whose values sum to zero.', 'nums = [-1,0,1,2,-1,-4]', '[[-1,-1,2],[-1,0,1]]', 'Medium', 'Arrays', 150, 30, 6),
  ('7', 'Trapping Rain Water', 'Calculate how much rain water can be trapped between elevation bars.', 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', '6', 'Hard', 'Arrays', 300, 60, 7),
  ('8', 'Median of Two Sorted Arrays', 'Find the median of two sorted arrays in logarithmic time.', 'nums1 = [1,3], nums2 = [2]', '2', 'Hard', 'Arrays', 350, 70, 8),
  ('9', 'Binary Tree Inorder Traversal', 'Return the inorder traversal of a binary tree.', 'root = [1,null,2,3]', '[1,3,2]', 'Easy', 'Trees', 60, 12, 9),
  ('10', 'Number of Islands', 'Count the connected groups of land in a two-dimensional grid.', 'grid = [["1","1","0"],["0","1","0"],["1","0","1"]]', '3', 'Medium', 'Graphs', 180, 36, 10),
  ('11', 'Word Ladder', 'Find the shortest transformation sequence between two words.', 'begin = "hit", end = "cog"', '5', 'Hard', 'Graphs', 320, 64, 11),
  ('12', 'LRU Cache', 'Implement a least-recently-used cache with constant-time reads and writes.', 'capacity = 2, operations = ["put","put","get"]', '[null,null,1]', 'Medium', 'Linked List', 200, 40, 12)
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  example_input = excluded.example_input,
  example_output = excluded.example_output,
  difficulty = excluded.difficulty,
  topic = excluded.topic,
  xp_reward = excluded.xp_reward,
  coin_reward = excluded.coin_reward,
  sort_order = excluded.sort_order,
  active = true,
  updated_at = now();

create table if not exists public.problem_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  problem_id text not null,
  xp_earned integer not null default 0 check (xp_earned >= 0),
  coins_earned integer not null default 0 check (coins_earned >= 0),
  completed_at timestamptz not null default now(),
  unique (user_id, problem_id)
);

create index if not exists problem_completions_user_completed_idx
on public.problem_completions (user_id, completed_at desc);

alter table public.problem_completions enable row level security;

drop policy if exists "Users can view their own problem completions" on public.problem_completions;
create policy "Users can view their own problem completions"
on public.problem_completions for select
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own problem completions" on public.problem_completions;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'problem_completions_problem_id_fkey'
      and conrelid = 'public.problem_completions'::regclass
  ) then
    alter table public.problem_completions
      add constraint problem_completions_problem_id_fkey
      foreign key (problem_id)
      references public.challenges(id)
      not valid;
  end if;
end;
$$;

create table if not exists public.skill_nodes (
  id text primary key,
  name text not null,
  topic text not null unique,
  position_x numeric(5, 2) not null check (position_x between 0 and 100),
  position_y numeric(5, 2) not null check (position_y between 0 and 100),
  sort_order integer not null unique,
  required_xp integer not null default 0 check (required_xp >= 0),
  required_challenges integer not null default 0 check (required_challenges >= 0),
  show_in_learning_progress boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.skill_nodes enable row level security;

drop policy if exists "Authenticated users can view skill nodes" on public.skill_nodes;
create policy "Authenticated users can view skill nodes"
on public.skill_nodes for select
to authenticated
using (true);

insert into public.skill_nodes (
  id,
  name,
  topic,
  position_x,
  position_y,
  sort_order,
  required_xp,
  required_challenges,
  show_in_learning_progress
)
values
  ('arrays', 'Arrays', 'Arrays', 10, 50, 1, 0, 0, true),
  ('strings', 'Strings', 'Strings', 25, 25, 2, 50, 1, true),
  ('linked', 'Linked List', 'Linked List', 25, 75, 3, 100, 2, true),
  ('stack', 'Stack', 'Stack', 45, 25, 4, 200, 3, false),
  ('queue', 'Queue', 'Queue', 45, 75, 5, 300, 4, false),
  ('trees', 'Trees', 'Trees', 65, 50, 6, 500, 5, true),
  ('graphs', 'Graphs', 'Graphs', 80, 25, 7, 800, 7, true),
  ('dp', 'Dynamic Programming', 'Dynamic Programming', 80, 75, 8, 1200, 9, true)
on conflict (id) do update
set
  name = excluded.name,
  topic = excluded.topic,
  position_x = excluded.position_x,
  position_y = excluded.position_y,
  sort_order = excluded.sort_order,
  required_xp = excluded.required_xp,
  required_challenges = excluded.required_challenges,
  show_in_learning_progress = excluded.show_in_learning_progress,
  updated_at = now();

create table if not exists public.skill_node_edges (
  parent_skill_id text not null references public.skill_nodes(id) on delete cascade,
  child_skill_id text not null references public.skill_nodes(id) on delete cascade,
  primary key (parent_skill_id, child_skill_id),
  check (parent_skill_id <> child_skill_id)
);

alter table public.skill_node_edges enable row level security;

drop policy if exists "Authenticated users can view skill edges" on public.skill_node_edges;
create policy "Authenticated users can view skill edges"
on public.skill_node_edges for select
to authenticated
using (true);

insert into public.skill_node_edges (parent_skill_id, child_skill_id)
values
  ('arrays', 'strings'),
  ('arrays', 'linked'),
  ('strings', 'stack'),
  ('linked', 'queue'),
  ('stack', 'trees'),
  ('queue', 'trees'),
  ('trees', 'graphs'),
  ('trees', 'dp')
on conflict do nothing;

create table if not exists public.user_skill_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  skill_id text not null references public.skill_nodes(id) on delete cascade,
  completed_challenges integer not null default 0 check (completed_challenges >= 0),
  total_challenges integer not null default 0 check (total_challenges >= 0),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  unlocked boolean not null default false,
  mastered boolean not null default false,
  unlocked_at timestamptz,
  mastered_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, skill_id)
);

alter table public.user_skill_progress enable row level security;

drop policy if exists "Users can view their own skill progress" on public.user_skill_progress;
create policy "Users can view their own skill progress"
on public.user_skill_progress for select
using ((select auth.uid()) = user_id);

create or replace function public.refresh_user_skill_progress(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_xp integer;
  v_completed_challenges integer;
begin
  if p_user_id is null then
    return;
  end if;

  select p.xp
  into v_xp
  from public.profiles p
  where p.id = p_user_id;

  if not found then
    return;
  end if;

  select count(*)::integer
  into v_completed_challenges
  from public.problem_completions pc
  join public.challenges c on c.id = pc.problem_id
  where pc.user_id = p_user_id
    and c.active;

  insert into public.user_skill_progress as current_progress (
    user_id,
    skill_id,
    completed_challenges,
    total_challenges,
    progress_percent,
    unlocked,
    mastered,
    unlocked_at,
    mastered_at,
    updated_at
  )
  select
    p_user_id,
    sn.id,
    stats.completed_challenges,
    stats.total_challenges,
    case
      when stats.total_challenges = 0 then 0
      else floor((stats.completed_challenges * 100.0) / stats.total_challenges)::integer
    end,
    requirements.met,
    requirements.met
      and stats.total_challenges > 0
      and stats.completed_challenges >= stats.total_challenges,
    case when requirements.met then now() else null end,
    case
      when requirements.met
        and stats.total_challenges > 0
        and stats.completed_challenges >= stats.total_challenges
      then now()
      else null
    end,
    now()
  from public.skill_nodes sn
  cross join lateral (
    select
      count(c.id)::integer as total_challenges,
      count(pc.id)::integer as completed_challenges
    from public.challenges c
    left join public.problem_completions pc
      on pc.problem_id = c.id
      and pc.user_id = p_user_id
    where c.active
      and c.topic = sn.topic
  ) stats
  cross join lateral (
    select (
      v_xp >= sn.required_xp
      and v_completed_challenges >= sn.required_challenges
    ) as met
  ) requirements
  on conflict (user_id, skill_id) do update
  set
    completed_challenges = excluded.completed_challenges,
    total_challenges = excluded.total_challenges,
    progress_percent = excluded.progress_percent,
    unlocked = excluded.unlocked,
    mastered = excluded.mastered,
    unlocked_at = case
      when excluded.unlocked
        then coalesce(current_progress.unlocked_at, excluded.unlocked_at)
      else null
    end,
    mastered_at = case
      when excluded.mastered
        then coalesce(current_progress.mastered_at, excluded.mastered_at)
      else null
    end,
    updated_at = now();
end;
$$;

create or replace function public.get_user_progress()
returns table (
  skill_id text,
  name text,
  topic text,
  position_x numeric,
  position_y numeric,
  required_xp integer,
  required_challenges integer,
  show_in_learning_progress boolean,
  completed_challenges integer,
  total_challenges integer,
  progress_percent integer,
  unlocked boolean,
  mastered boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'You must be logged in to view progress.';
  end if;

  perform public.refresh_user_skill_progress(v_user_id);

  return query
  select
    sn.id,
    sn.name,
    sn.topic,
    sn.position_x,
    sn.position_y,
    sn.required_xp,
    sn.required_challenges,
    sn.show_in_learning_progress,
    usp.completed_challenges,
    usp.total_challenges,
    usp.progress_percent,
    usp.unlocked,
    usp.mastered
  from public.skill_nodes sn
  join public.user_skill_progress usp
    on usp.skill_id = sn.id
    and usp.user_id = v_user_id
  order by sn.sort_order;
end;
$$;

drop function if exists public.complete_problem(text, integer, integer);

create or replace function public.complete_problem(p_problem_id text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_challenge public.challenges;
  v_profile public.profiles;
  v_inserted boolean := false;
  v_new_xp integer;
  v_new_level integer;
  v_problem_count integer;
begin
  if v_user_id is null then
    raise exception 'You must be logged in to complete a challenge.';
  end if;

  select *
  into v_challenge
  from public.challenges c
  where c.id = nullif(trim(p_problem_id), '')
    and c.active;

  if v_challenge.id is null then
    raise exception 'Challenge not found.';
  end if;

  insert into public.problem_completions (
    user_id,
    problem_id,
    xp_earned,
    coins_earned
  )
  values (
    v_user_id,
    v_challenge.id,
    v_challenge.xp_reward,
    v_challenge.coin_reward
  )
  on conflict (user_id, problem_id) do nothing
  returning true into v_inserted;

  select *
  into v_profile
  from public.profiles
  where id = v_user_id
  for update;

  if v_profile.id is null then
    raise exception 'Profile not found.';
  end if;

  if coalesce(v_inserted, false) then
    v_new_xp := v_profile.xp + v_challenge.xp_reward;
    v_new_level := greatest(floor(v_new_xp / 500.0)::integer + 1, 1);

    select count(*)::integer
    into v_problem_count
    from public.problem_completions
    where user_id = v_user_id;

    update public.profiles
    set
      xp = v_new_xp,
      coins = coins + v_challenge.coin_reward,
      problems_solved = v_problem_count,
      streak = greatest(streak, 1),
      level = v_new_level,
      title = case
        when v_new_level >= 10 then 'Algorithm Knight'
        when v_new_level >= 5 then 'Quest Coder'
        when v_new_level >= 3 then 'Bug Slayer'
        else 'Code Apprentice'
      end,
      updated_at = now()
    where id = v_user_id
    returning * into v_profile;
  end if;

  perform public.refresh_user_skill_progress(v_user_id);
  return v_profile;
end;
$$;

create table if not exists public.daily_mission_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mission_id text not null,
  mission_date date not null,
  xp_earned integer not null default 0 check (xp_earned >= 0),
  coins_earned integer not null default 0 check (coins_earned >= 0),
  claimed_at timestamptz not null default now(),
  unique (user_id, mission_id, mission_date)
);

alter table public.daily_mission_claims enable row level security;

drop policy if exists "Users can view their own daily mission claims" on public.daily_mission_claims;
create policy "Users can view their own daily mission claims"
on public.daily_mission_claims for select
using ((select auth.uid()) = user_id);

create or replace function public.get_daily_missions()
returns table (
  mission_id text,
  title text,
  progress integer,
  total integer,
  xp_reward integer,
  coins_reward integer,
  done boolean,
  claimed boolean,
  mission_date date
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
  v_start timestamptz := (((now() at time zone 'Asia/Kolkata')::date)::timestamp at time zone 'Asia/Kolkata');
  v_end timestamptz := ((((now() at time zone 'Asia/Kolkata')::date + 1)::timestamp) at time zone 'Asia/Kolkata');
begin
  if v_user_id is null then
    raise exception 'You must be logged in to view daily missions.';
  end if;

  return query
  with stats as (
    select
      count(*)::integer as problem_count,
      coalesce(sum(pc.xp_earned), 0)::integer as xp_today
    from public.problem_completions pc
    where pc.user_id = v_user_id
      and pc.completed_at >= v_start
      and pc.completed_at < v_end
  ),
  missions as (
    select 'solve_one'::text as mission_id, 'Solve 1 problem today'::text as title,
      least(stats.problem_count, 1)::integer as progress, 1::integer as total,
      50::integer as xp_reward, 10::integer as coins_reward
    from stats
    union all
    select 'solve_three', 'Solve 3 problems today',
      least(stats.problem_count, 3)::integer, 3,
      150, 50
    from stats
    union all
    select 'earn_150_xp', 'Earn 150 XP today',
      least(stats.xp_today, 150)::integer, 150,
      100, 30
    from stats
    union all
    select 'keep_streak', 'Keep your streak alive',
      case when stats.problem_count > 0 then 1 else 0 end::integer, 1,
      50, 10
    from stats
  )
  select
    missions.mission_id,
    missions.title,
    missions.progress,
    missions.total,
    missions.xp_reward,
    missions.coins_reward,
    (missions.progress >= missions.total) as done,
    exists (
      select 1
      from public.daily_mission_claims dmc
      where dmc.user_id = v_user_id
        and dmc.mission_id = missions.mission_id
        and dmc.mission_date = v_today
    ) as claimed,
    v_today as mission_date
  from missions
  order by missions.total, missions.mission_id;
end;
$$;

create or replace function public.claim_daily_mission(p_mission_id text)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_mission record;
  v_profile public.profiles;
  v_new_xp integer;
  v_new_level integer;
begin
  if v_user_id is null then
    raise exception 'You must be logged in to claim a daily mission.';
  end if;

  select *
  into v_mission
  from public.get_daily_missions()
  where mission_id = p_mission_id;

  if v_mission.mission_id is null then
    raise exception 'Daily mission not found.';
  end if;

  if not v_mission.done then
    raise exception 'Daily mission is not complete yet.';
  end if;

  if v_mission.claimed then
    raise exception 'Daily mission reward already claimed.';
  end if;

  insert into public.daily_mission_claims (
    user_id,
    mission_id,
    mission_date,
    xp_earned,
    coins_earned
  )
  values (
    v_user_id,
    v_mission.mission_id,
    v_mission.mission_date,
    v_mission.xp_reward,
    v_mission.coins_reward
  );

  select *
  into v_profile
  from public.profiles
  where id = v_user_id
  for update;

  v_new_xp := v_profile.xp + v_mission.xp_reward;
  v_new_level := greatest(floor(v_new_xp / 500.0)::integer + 1, 1);

  update public.profiles
  set
    xp = v_new_xp,
    coins = coins + v_mission.coins_reward,
    level = v_new_level,
    title = case
      when v_new_level >= 10 then 'Algorithm Knight'
      when v_new_level >= 5 then 'Quest Coder'
      when v_new_level >= 3 then 'Bug Slayer'
      else 'Code Apprentice'
    end,
    updated_at = now()
  where id = v_user_id
  returning * into v_profile;

  perform public.refresh_user_skill_progress(v_user_id);
  return v_profile;
end;
$$;

revoke all on function public.refresh_user_skill_progress(uuid) from public;
revoke all on function public.refresh_user_skill_progress(uuid) from anon;
revoke all on function public.refresh_user_skill_progress(uuid) from authenticated;

revoke all on function public.get_user_progress() from public;
revoke all on function public.get_user_progress() from anon;
grant execute on function public.get_user_progress() to authenticated;

revoke all on function public.complete_problem(text) from public;
revoke all on function public.complete_problem(text) from anon;
grant execute on function public.complete_problem(text) to authenticated;

revoke all on function public.get_daily_missions() from public;
revoke all on function public.get_daily_missions() from anon;
grant execute on function public.get_daily_missions() to authenticated;

revoke all on function public.claim_daily_mission(text) from public;
revoke all on function public.claim_daily_mission(text) from anon;
grant execute on function public.claim_daily_mission(text) to authenticated;

grant select on public.challenges to authenticated;
grant select on public.problem_completions to authenticated;
grant select on public.skill_nodes to authenticated;
grant select on public.skill_node_edges to authenticated;
grant select on public.user_skill_progress to authenticated;
grant select on public.daily_mission_claims to authenticated;

revoke insert, update, delete on public.challenges from public, anon, authenticated;
revoke insert, update, delete on public.problem_completions from public, anon, authenticated;
revoke insert, update, delete on public.skill_nodes from public, anon, authenticated;
revoke insert, update, delete on public.skill_node_edges from public, anon, authenticated;
revoke insert, update, delete on public.user_skill_progress from public, anon, authenticated;
revoke insert, update, delete on public.daily_mission_claims from public, anon, authenticated;
