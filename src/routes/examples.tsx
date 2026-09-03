import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PublicProfileView } from "@/components/PublicProfileView";
import { ThemeToggle } from "@/components/ThemeToggle";

const TITLE = "Link in Bio Example — Novanodes";
const DESCRIPTION =
  "See a real link in bio layout for a developer, and copy the structure for your own Novanodes profile in two minutes.";
const URL = "https://novanodes-app.lovable.app/examples";

export const Route = createFileRoute("/examples")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: ExamplesPage,
});

const EXAMPLE_PROFILE = {
  username: "devexample",
  display_name: "Aria Chen",
  bio: "Full-stack engineer. TypeScript, Postgres and small tools that ship.",
  avatar_url: null,
  location: "Berlin, Germany",
  website_url: null,
};

const EXAMPLE_LINKS = [
  { id: "d1", title: "Portfolio", url: "https://example.com", platform: "website" },
  { id: "d2", title: "GitHub", url: "https://github.com/example", platform: "github" },
  { id: "d3", title: "LinkedIn", url: "https://linkedin.com/in/example", platform: "linkedin" },
  { id: "d4", title: "Résumé (PDF)", url: "https://example.com/resume", platform: "website" },
];

const TIPS = [
  "Lead with the project you most want people to open.",
  "Keep GitHub and LinkedIn adjacent so recruiters find both.",
  "Add a résumé or 'work with me' link at the bottom.",
];

function ExamplesPage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid size-8 place-items-center rounded-full border border-primary/40 text-primary">
            <span className="size-2 rounded-full bg-primary" />
          </span>
          Novanodes
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link to="/auth" search={{ mode: "signup" }}>
              Get started
            </Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Example</p>
            <h1 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
              A developer's link in bio
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Put the work first: a portfolio or standout repo at the top, then the places people
              can follow along or hire you.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {TIPS.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
            <Button asChild className="mt-7">
              <Link to="/auth" search={{ mode: "signup" }}>
                Create your Novanodes
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <PhoneFrame>
              <PublicProfileView profile={EXAMPLE_PROFILE} links={EXAMPLE_LINKS} compact />
            </PhoneFrame>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-8 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Novanodes</p>
        <span className="hidden sm:inline">One link. Your whole universe.</span>
      </footer>
    </div>
  );
}
