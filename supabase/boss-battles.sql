-- Real Boss Battles migration for an existing CodeQuest.AI project.
-- Run this file once in Supabase SQL Editor after progress-update.sql.

create table if not exists public.boss_definitions (
  id text primary key,
  name text not null,
  title text not null,
  image text not null,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  challenge_id text not null references public.challenges(id) on delete restrict,
  max_hp integer not null check (max_hp > 0),
  xp_reward integer not null check (xp_reward >= 0),
  coin_reward integer not null check (coin_reward >= 0),
  item_reward text not null,
  sort_order integer not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.boss_definitions enable row level security;

drop policy if exists "Authenticated users can view bosses" on public.boss_definitions;
create policy "Authenticated users can view bosses"
on public.boss_definitions for select to authenticated using (active);

insert into public.boss_definitions
  (id, name, title, image, difficulty, challenge_id, max_hp, xp_reward, coin_reward, item_reward, sort_order)
values
  ('stack-phantom', 'Stack Phantom', 'Keeper of Balanced Brackets', '👻', 'Easy', '2', 500, 150, 30, 'Phantom Badge', 1),
  ('array-titan', 'Array Titan', 'Lord of the Flooded Valley', '🗿', 'Hard', '7', 1200, 500, 100, 'Titan Crown', 2),
  ('graph-dragon', 'Graph Dragon', 'Guardian of the Island Realm', '🐉', 'Medium', '10', 900, 350, 70, 'Dragon Scale', 3)
on conflict (id) do update set
  name = excluded.name,
  title = excluded.title,
  image = excluded.image,
  difficulty = excluded.difficulty,
  challenge_id = excluded.challenge_id,
  max_hp = excluded.max_hp,
  xp_reward = excluded.xp_reward,
  coin_reward = excluded.coin_reward,
  item_reward = excluded.item_reward,
  sort_order = excluded.sort_order,
  active = true;

create table if not exists public.boss_reward_claims (
  user_id uuid not null references public.profiles(id) on delete cascade,
  boss_id text not null references public.boss_definitions(id) on delete cascade,
  xp_earned integer not null check (xp_earned >= 0),
  coins_earned integer not null check (coins_earned >= 0),
  claimed_at timestamptz not null default now(),
  primary key (user_id, boss_id)
);

alter table public.boss_reward_claims enable row level security;

drop policy if exists "Users can view their boss rewards" on public.boss_reward_claims;
create policy "Users can view their boss rewards"
on public.boss_reward_claims for select
using ((select auth.uid()) = user_id);

create or replace function public.get_boss_battles()
returns table (
  boss_id text, name text, title text, image text, difficulty text,
  challenge_id text, challenge_title text, description text,
  max_hp integer, xp_reward integer, coin_reward integer, item_reward text,
  defeated boolean, claimed boolean
)
language sql security definer set search_path = public
as $$
  select
    b.id, b.name, b.title, b.image, b.difficulty,
    b.challenge_id, c.title, c.description,
    b.max_hp, b.xp_reward, b.coin_reward, b.item_reward,
    exists (
      select 1 from public.problem_completions pc
      where pc.user_id = auth.uid() and pc.problem_id = b.challenge_id
    ),
    exists (
      select 1 from public.boss_reward_claims brc
      where brc.user_id = auth.uid() and brc.boss_id = b.id
    )
  from public.boss_definitions b
  join public.challenges c on c.id = b.challenge_id and c.active
  where b.active and auth.uid() is not null
  order by b.sort_order;
$$;

create or replace function public.claim_boss_reward(p_boss_id text)
returns public.profiles
language plpgsql security definer set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_boss public.boss_definitions;
  v_profile public.profiles;
begin
  if v_user_id is null then raise exception 'You must be logged in.'; end if;

  select * into v_boss from public.boss_definitions
  where id = p_boss_id and active;
  if not found then raise exception 'Boss not found.'; end if;

  if not exists (
    select 1 from public.problem_completions
    where user_id = v_user_id and problem_id = v_boss.challenge_id
  ) then
    raise exception 'Defeat this boss before claiming rewards.';
  end if;

  insert into public.boss_reward_claims (user_id, boss_id, xp_earned, coins_earned)
  values (v_user_id, v_boss.id, v_boss.xp_reward, v_boss.coin_reward)
  on conflict (user_id, boss_id) do nothing;

  if found then
    update public.profiles
    set xp = xp + v_boss.xp_reward,
        coins = coins + v_boss.coin_reward,
        level = greatest(floor((xp + v_boss.xp_reward) / 500.0)::integer + 1, 1),
        updated_at = now()
    where id = v_user_id;
  end if;

  select * into v_profile from public.profiles where id = v_user_id;
  return v_profile;
end;
$$;

revoke all on function public.get_boss_battles() from public, anon;
grant execute on function public.get_boss_battles() to authenticated;
revoke all on function public.claim_boss_reward(text) from public, anon;
grant execute on function public.claim_boss_reward(text) to authenticated;
grant select on public.boss_definitions, public.boss_reward_claims to authenticated;
revoke insert, update, delete on public.boss_definitions, public.boss_reward_claims from public, anon, authenticated;
