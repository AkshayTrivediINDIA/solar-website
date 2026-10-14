-- Surya Solar — orders (Phase 2 e-commerce)
-- Run in the Supabase SQL editor. Safe to re-run.

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

create index if not exists orders_created_idx   on public.orders (created_at desc);
create index if not exists orders_status_idx    on public.orders (status);
create index if not exists orders_user_idx      on public.orders (user_id);
create index if not exists order_items_order_idx on public.order_items (order_id);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — orders are private.
-- Service role (server/admin) bypasses RLS. Signed-in customers may read their
-- own orders (auth.uid() = user_id); nothing else is publicly accessible.
-- ---------------------------------------------------------------------------
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "orders select own" on public.orders;
create policy "orders select own" on public.orders
  for select using (auth.uid() = user_id);
