import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession } from "@/hooks/useSession";

/** Shared shell for the public marketing / SEO content pages. */
export function MarketingLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid size-8 place-items-center rounded-full border border-primary/40 text-primary">
            <span className="size-2 rounded-full bg-primary" />
          </span>
          LTReee
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm">
            {isAuthenticated ? (
              <Link to="/dashboard">Dashboard</Link>
            ) : (
              <Link to="/auth" search={{ mode: "signup" }}>
                Get started
              </Link>
            )}
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pb-12">{children}</main>

      <section className="mx-auto w-full max-w-3xl px-5 pb-16">
        <div className="rounded-3xl glass-strong px-6 py-10 text-center">
          <h2 className="font-display text-2xl font-semibold">Claim your link in bio page</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Free, fast and dark by default. One link for every link you own.
          </p>
          <Button asChild size="lg" className="mt-6">
            {isAuthenticated ? (
              <Link to="/dashboard">
                Go to dashboard
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : (
              <Link to="/auth" search={{ mode: "signup" }}>
                Create your LTReee
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

export function MarketingFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl border-t border-border px-5 py-8 text-xs text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} LTReee</p>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-4">
          <Link to="/link-in-bio" className="hover:text-foreground">
            What is a link in bio
          </Link>
          <Link to="/linktree-alternative" className="hover:text-foreground">
            Linktree alternative
          </Link>
          <Link to="/developers" className="hover:text-foreground">
            For developers
          </Link>
          <Link to="/examples" className="hover:text-foreground">
            Examples
          </Link>
        </nav>
      </div>
    </footer>
  );
}
