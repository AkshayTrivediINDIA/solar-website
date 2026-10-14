-- Surya Solar — link orders to authenticated customers (Supabase Auth)
-- Run ONCE in the Supabase SQL editor after schema.sql / orders.sql.
-- Safe to re-run.

alter table public.orders
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists orders_user_idx on public.orders (user_id);

-- Signed-in customers may read their own orders. The service_role key still
-- bypasses RLS for admin/server reads and writes.
drop policy if exists "orders select own" on public.orders;
create policy "orders select own" on public.orders
  for select using (auth.uid() = user_id);
