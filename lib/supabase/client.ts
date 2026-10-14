import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | undefined;

/**
 * Browser Supabase client (cookie-based session via @supabase/ssr).
 *
 * Returns `null` when Supabase env vars are missing so auth UI can show a
 * friendly "not configured" message instead of crashing.
 */
export function createSupabaseBrowserClient(): SupabaseClient | null {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  browserClient = createBrowserClient(url, key);
  return browserClient;
}
