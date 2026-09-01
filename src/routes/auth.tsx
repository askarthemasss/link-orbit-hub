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

const AUTH_REDIRECT_KEY = "linkorbit-auth-redirect";

const searchSchema = z.object({
  mode: z.enum(["login", "signup", "reset"]).optional(),
  next: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — LinkOrbit" },
      { name: "description", content: "Sign in or create your free LinkOrbit profile." },
      { property: "og:title", content: "Sign in — LinkOrbit" },
      { property: "og:description", content: "Sign in or create your free LinkOrbit profile." },
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
    mode === "signup" ? "Create your LinkOrbit" : mode === "reset" ? "Reset your password" : "Welcome back";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Link to="/" className="font-display text-lg font-semibold">
          LinkOrbit
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
                className="w-full"
                disabled={busy}
                onClick={() => void handleGoogle()}
              >
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
                    Create your LinkOrbit
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
