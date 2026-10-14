-- Surya Solar — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  sku               text not null unique,
  category_id       uuid references public.categories (id) on delete set null,
  short_description text,
  description       text,
  price             numeric(12, 2) not null default 0,
  mrp               numeric(12, 2),
  unit              text not null default 'per unit',
  stock             int not null default 0,
  wattage           int,
  capacity          text,
  featured          boolean not null default false,
  badge             text,
  images            text[] not null default '{}',
  specs             jsonb not null default '[]'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------
do $$ begin
  create type lead_type as enum ('quote', 'contact', 'dealership', 'complaint');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new', 'contacted', 'won', 'lost');
exception when duplicate_object then null; end $$;

create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  phone            text not null,
  email            text,
  city             text,
  type             lead_type not null default 'contact',
  product_interest text,
  message          text,
  status           lead_status not null default 'new',
  created_at       timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx  on public.leads (status);

-- ---------------------------------------------------------------------------
-- updated_at trigger for products
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- The public anon key may READ the catalogue and INSERT leads.
-- The admin dashboard uses the service_role key, which bypasses RLS.
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products  enable row level security;
alter table public.leads     enable row level security;

drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories
  for select using (true);

drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select using (true);

drop policy if exists "leads public insert" on public.leads;
create policy "leads public insert" on public.leads
  for insert with check (true);

-- No public select/update/delete on leads — only service_role (admin) can read them.

-- ---------------------------------------------------------------------------
-- Orders (Phase 2 e-commerce)
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text not null unique,
  user_id            uuid references auth.users (id) on delete set null,
  customer_name      text not null,
  customer_phone     text not null,
  customer_email     text,
  address_line1      text not null,
  address_line2      text,
  city               text not null,
  state              text not null,
  pincode            text not null,
  notes              text,
  subtotal           numeric(12, 2) not null default 0,
  shipping           numeric(12, 2) not null default 0,
  total              numeric(12, 2) not null default 0,
  payment_method     text not null default 'cod',
  payment_status     text not null default 'pending',
  status             text not null default 'pending',
  razorpay_order_id  text,
  razorpay_payment_id text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  product_id  uuid references public.products (id) on delete set null,
  name        text not null,
  price       numeric(12, 2) not null default 0,
  quantity    int not null default 1,
  subtotal    numeric(12, 2) not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists orders_created_idx    on public.orders (created_at desc);
create index if not exists orders_status_idx     on public.orders (status);
create index if not exists orders_user_idx       on public.orders (user_id);
create index if not exists order_items_order_idx on public.order_items (order_id);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
-- Service role (server/admin) bypasses RLS. Signed-in customers may read their
-- own orders; nothing else is publicly accessible.
drop policy if exists "orders select own" on public.orders;
create policy "orders select own" on public.orders
  for select using (auth.uid() = user_id);
