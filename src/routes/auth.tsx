import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const AUTH_REDIRECT_KEY = "ltreee-auth-redirect";

const searchSchema = z.object({
  mode: z.enum(["login", "signup", "reset"]).optional(),
  next: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — LTReee" },
      { name: "description", content: "Sign in or create your free LTReee profile." },
      { property: "og:title", content: "Sign in — LTReee" },
      { property: "og:description", content: "Sign in or create your free LTReee profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "reset";

function AuthPage() {
  const { mode: initialMode, next } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(initialMode ?? "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Only same-origin relative paths may be used as a post-login destination.
  const safeNext = next && /^\/(?!\/)/.test(next) ? next : null;

  function goNext() {
    if (safeNext) {
      void navigate({ href: safeNext, replace: true });
      return;
    }
    void navigate({ to: "/dashboard", replace: true });
  }

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getUser().then(({ data }) => {
      if (cancelled || !data.user) return;
      if (safeNext) void navigate({ href: safeNext, replace: true });
      else void navigate({ to: "/dashboard", replace: true });
    });

    return () => {
      cancelled = true;
    };
  }, [navigate, safeNext]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice("Check your inbox for a password reset link.");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${safeNext ?? "/dashboard"}` },
        });
        if (error) throw error;
        if (data.session) {
          goNext();
        } else {
          setNotice("Almost there — confirm your email address to activate your account.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.user) throw new Error("We couldn't confirm your sign-in. Please try again.");
        goNext();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const destination = safeNext ?? "/dashboard";
    sessionStorage.setItem(AUTH_REDIRECT_KEY, destination);

    try {
      // Always return to this public route. The root auth listener consumes the
      // pending destination after the OAuth session has been established.
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        sessionStorage.removeItem(AUTH_REDIRECT_KEY);
        toast.error("Google sign-in failed. Please try again.");
        return;
      }
      if (result.redirected) return;

      sessionStorage.removeItem(AUTH_REDIRECT_KEY);
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("We couldn't confirm your Google sign-in. Please try again.");
      goNext();
    } catch (error) {
      sessionStorage.removeItem(AUTH_REDIRECT_KEY);
      toast.error(error instanceof Error ? error.message : "Google sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const title =
    mode === "signup" ? "Create your LTReee" : mode === "reset" ? "Reset your password" : "Welcome back";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Link to="/" className="font-display text-lg font-semibold">
          LTReee
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-sm rounded-2xl glass p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "reset"
              ? "We'll email you a link to choose a new password."
              : "One link for everything worth sharing."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {mode !== "reset" ? (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            ) : null}

            {notice ? (
              <p role="status" className="rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                {notice}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              {mode === "signup" ? "Create account" : mode === "reset" ? "Send reset link" : "Log in"}
            </Button>
          </form>

          {mode !== "reset" ? (
            <>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
              </div>
              <Button
                type="button"
                variant="secondary"
                className="w-full gap-2"
                disabled={busy}
                onClick={() => void handleGoogle()}
              >
                <svg className="size-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </>
          ) : null}

          <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                <p>
                  New here?{" "}
                  <button type="button" className="text-primary hover:underline" onClick={() => setMode("signup")}>
                    Create your LTReee
                  </button>
                </p>
                <p>
                  <button type="button" className="text-xs hover:underline" onClick={() => setMode("reset")}>
                    Forgot your password?
                  </button>
                </p>
              </>
            ) : (
              <p>
                Already have an account?{" "}
                <button type="button" className="text-primary hover:underline" onClick={() => setMode("login")}>
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
