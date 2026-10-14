import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];
const AUTH_REQUIRED_PATHS = ["/checkout", "/account"];

function isProtectedCustomerPath(pathname: string) {
  return AUTH_REQUIRED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function redirectTo(
  request: NextRequest,
  pathname: string,
  params: Record<string, string> = {},
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasAuthCookie = request.cookies.getAll().some((c) => c.name.startsWith("sb-"));

  let userId: string | null = null;

  // Refresh the Supabase session cookie (only when relevant, to avoid an
  // extra round-trip on every anonymous request).
  if (url && key && (hasAuthCookie || isProtectedCustomerPath(pathname))) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  }

  // Admin area uses its own signed cookie (see lib/auth.ts).
  if (pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!request.cookies.has("ss_admin")) {
      return redirectTo(request, "/admin/login", { next: pathname });
    }
  }

  // Customer area requires a Supabase session.
  if (isProtectedCustomerPath(pathname) && !userId) {
    return redirectTo(request, "/login", { next: pathname });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
