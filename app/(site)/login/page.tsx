import { redirect } from "next/navigation";
import { LoginView } from "@/components/auth/login-view";
import { getCurrentUser } from "@/lib/supabase/server";
import { getEnabledAuthProviders, isSupabaseConfigured } from "@/lib/supabase";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const nextUrl =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";

  const user = await getCurrentUser();
  if (user) redirect(nextUrl);

  const providers = await getEnabledAuthProviders();

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <LoginView
        nextUrl={nextUrl}
        configured={isSupabaseConfigured()}
        googleEnabled={providers?.google === true}
        hadAuthError={error === "auth"}
      />
    </div>
  );
}
