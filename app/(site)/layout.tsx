import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { getCategories } from "@/lib/data";
import { getCurrentUser } from "@/lib/supabase/server";
import type { AuthUser } from "@/lib/types";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [categories, user] = await Promise.all([getCategories(), getCurrentUser()]);

  const authUser: AuthUser | null = user
    ? {
        id: user.id,
        email: user.email ?? null,
        name:
          (user.user_metadata?.full_name as string | undefined) ??
          (user.user_metadata?.name as string | undefined) ??
          user.email ??
          user.phone ??
          null,
      }
    : null;

  return (
    <>
      <SiteHeader categories={categories} user={authUser} />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={categories} />
      <WhatsAppFloat />
    </>
  );
}
