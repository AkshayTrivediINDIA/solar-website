"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Mail, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export function LoginView({
  nextUrl,
  configured,
  googleEnabled,
  hadAuthError,
}: {
  nextUrl: string;
  configured: boolean;
  googleEnabled: boolean;
  hadAuthError: boolean;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  function getClient() {
    const sb = createSupabaseBrowserClient();
    if (!sb) toast.error("Login is not configured yet. Please contact support.");
    return sb;
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    const sb = getClient();
    if (!sb) return;
    setLoading(true);
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setLinkSent(true);
    toast.success("Sign-in link sent — check your email");
  }

  async function signInWithGoogle() {
    const sb = getClient();
    if (!sb) return;
    setLoading(true);
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
      },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-1 text-center">
          <h1 className="font-heading text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Login required to place an order. Verify with a magic link or Google — no password needed.
          </p>
        </div>

        {hadAuthError ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-xs text-destructive">
            Sign-in link expired or invalid. Please request a new one.
          </p>
        ) : null}

        {!configured ? (
          <p className="rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
            Authentication is not configured yet. Please contact support.
          </p>
        ) : null}

        <Button
          type="button"
          variant="outline"
          className="h-10 w-full gap-2"
          onClick={signInWithGoogle}
          disabled={!configured || !googleEnabled || loading}
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        {configured && !googleEnabled ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-center text-xs text-amber-800">
            Google login abhi set up nahi hai — filhal email magic link se sign in karo.
          </p>
        ) : null}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        {linkSent ? (
          <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <MailCheck className="mx-auto size-8 text-emerald-600" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-emerald-900">Check your email</p>
              <p className="text-xs text-emerald-800">
                We&apos;ve sent a sign-in link to{" "}
                <span className="font-medium">{email.trim()}</span>. Click the link in that email to
                sign in.
              </p>
              <p className="text-xs text-emerald-700/80">
                Didn&apos;t get it? Check spam/promotions, or resend below.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 w-full bg-background"
                disabled={loading}
                onClick={sendMagicLink}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
                Resend link
              </Button>
              <button
                type="button"
                onClick={() => {
                  setLinkSent(false);
                  setEmail("");
                }}
                className="flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" /> Use a different email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={sendMagicLink} className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="login-email">Email address</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="h-10 w-full"
              disabled={loading || !configured || email.trim().length === 0}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
              Email me a sign-in link
            </Button>
          </form>
        )}

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <span className="font-medium text-foreground">Terms &amp; Privacy Policy</span>.
        </p>
      </CardContent>
    </Card>
  );
}
