import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase clients.
 *
 * - `getPublicClient()` uses the anon key (respects Row Level Security).
 * - `getAdminClient()` uses the service role key (bypasses RLS) for writes/admin.
 *
 * Both return `null` when Supabase is not configured, so the app can fall back
 * to bundled seed data during local development and builds.
 */

let publicClient: SupabaseClient | null | undefined;
let adminClient: SupabaseClient | null | undefined;

export function getPublicClient(): SupabaseClient | null {
  if (publicClient !== undefined) return publicClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  publicClient = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return publicClient;
}

export function getAdminClient(): SupabaseClient | null {
  if (adminClient !== undefined) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  adminClient = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return adminClient;
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Returns the map of external auth providers enabled on the Supabase project
 * (e.g. `{ email: true, google: false, ... }`), or `null` if unavailable.
 */
export async function getEnabledAuthProviders(): Promise<Record<string, boolean> | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: key },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { external?: Record<string, boolean> };
    return json.external ?? null;
  } catch {
    return null;
  }
}
