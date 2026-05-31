
-- Roles enum
create type public.app_role as enum ('admin', 'supervisor', 'user');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  total_credits numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

create policy "roles_select_own" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "roles_admin_all" on public.user_roles for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Waste categories
create table public.waste_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  credits_per_kg numeric not null default 1,
  description text,
  created_at timestamptz not null default now()
);

grant select on public.waste_categories to authenticated, anon;
grant all on public.waste_categories to service_role;
alter table public.waste_categories enable row level security;

create policy "categories_public_read" on public.waste_categories for select to authenticated, anon using (true);
create policy "categories_admin_write" on public.waste_categories for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.waste_categories (name, credits_per_kg, description) values
  ('Plastic Bottles', 5, 'PET bottles, food-grade plastic containers'),
  ('Paper & Cardboard', 2, 'Old newspapers, magazines, cartons'),
  ('Aluminum Cans', 8, 'Soft drink cans, food cans'),
  ('Glass', 3, 'Bottles and jars'),
  ('E-Waste', 12, 'Phones, chargers, small electronics'),
  ('Organic / Compost', 1, 'Food scraps for composting');

-- Pickup requests
create table public.pickup_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.waste_categories(id),
  address text not null,
  city text,
  estimated_weight_kg numeric not null,
  preferred_date date,
  notes text,
  status text not null default 'pending', -- pending | approved | completed | rejected
  credits_awarded numeric not null default 0,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.pickup_requests to authenticated;
grant all on public.pickup_requests to service_role;
alter table public.pickup_requests enable row level security;

create policy "pickups_select_own" on public.pickup_requests for select to authenticated using (auth.uid() = user_id);
create policy "pickups_insert_own" on public.pickup_requests for insert to authenticated with check (auth.uid() = user_id and status = 'pending');
create policy "pickups_update_own_pending" on public.pickup_requests for update to authenticated using (auth.uid() = user_id and status = 'pending');

create policy "pickups_admin_select" on public.pickup_requests for select to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'supervisor'));
create policy "pickups_admin_update" on public.pickup_requests for update to authenticated using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'supervisor'));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger pickups_updated_at before update on public.pickup_requests for each row execute function public.set_updated_at();

-- Auto-create profile + default 'user' role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role) values (new.id, 'user')
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Award credits on approval/completion
create or replace function public.award_pickup_credits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('approved','completed') and old.status not in ('approved','completed') then
    -- Compute credits if not set
    if coalesce(new.credits_awarded, 0) = 0 and new.category_id is not null then
      select round(new.estimated_weight_kg * wc.credits_per_kg, 2)
        into new.credits_awarded
      from public.waste_categories wc where wc.id = new.category_id;
    end if;

    update public.profiles
      set total_credits = total_credits + coalesce(new.credits_awarded, 0)
      where id = new.user_id;

    new.reviewed_at = now();
  end if;
  return new;
end;
$$;

create trigger pickups_award_credits
  before update on public.pickup_requests
  for each row execute function public.award_pickup_credits();
