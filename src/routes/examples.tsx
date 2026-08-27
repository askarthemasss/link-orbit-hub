import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PublicProfileView } from "@/components/PublicProfileView";
import { ThemeToggle } from "@/components/ThemeToggle";

const TITLE = "Link in Bio Examples — LinkOrbit";
const DESCRIPTION =
  "See real link in bio examples for developers, artists and writers, and copy the layout for your own LinkOrbit profile in two minutes.";
const URL = "https://linkorbit-app.lovable.app/examples";

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

type Example = {
  slug: string;
  audience: string;
  summary: string;
  tips: string[];
  profile: {
    username: string;
    display_name: string;
    bio: string;
    avatar_url: null;
    location: string | null;
    website_url: string | null;
  };
  links: { id: string; title: string; url: string; platform: string }[];
};

const EXAMPLES: Example[] = [
  {
    slug: "developer",
    audience: "Developer",
    summary:
      "Put the work first: a portfolio or standout repo at the top, then the places people can follow along or hire you.",
    tips: [
      "Lead with the project you most want people to open.",
      "Keep GitHub and LinkedIn adjacent so recruiters find both.",
      "Add a résumé or 'work with me' link at the bottom.",
    ],
    profile: {
      username: "devexample",
      display_name: "Aria Chen",
      bio: "Full-stack engineer. TypeScript, Postgres and small tools that ship.",
      avatar_url: null,
      location: "Berlin, Germany",
      website_url: null,
    },
    links: [
      { id: "d1", title: "Portfolio", url: "https://example.com", platform: "website" },
      { id: "d2", title: "GitHub", url: "https://github.com/example", platform: "github" },
      { id: "d3", title: "LinkedIn", url: "https://linkedin.com/in/example", platform: "linkedin" },
      { id: "d4", title: "Résumé (PDF)", url: "https://example.com/resume", platform: "website" },
    ],
  },
  {
    slug: "artist",
    audience: "Artist",
    summary:
      "Visual work sells itself. Send people to the gallery and the shop, and keep commissions one tap away.",
    tips: [
      "Point the first link at your strongest gallery or reel.",
      "Give the shop its own link instead of burying it in a bio.",
      "Include a commissions or enquiry link so briefs reach you.",
    ],
    profile: {
      username: "artexample",
      display_name: "Noor Haddad",
      bio: "Illustrator working in risograph and ink. Commissions open.",
      avatar_url: null,
      location: "Lisbon, Portugal",
      website_url: null,
    },
    links: [
      { id: "a1", title: "Instagram", url: "https://instagram.com/example", platform: "instagram" },
      { id: "a2", title: "Print shop", url: "https://example.com/shop", platform: "website" },
      { id: "a3", title: "Behance portfolio", url: "https://behance.net/example", platform: "website" },
      { id: "a4", title: "Commission enquiries", url: "https://example.com/commissions", platform: "website" },
    ],
  },
  {
    slug: "writer",
    audience: "Writer",
    summary:
      "Readers arrive from one post. Give them the newsletter, the archive and a way to get in touch.",
    tips: [
      "Make subscribing the very first action.",
      "Link the archive or your best essay for new readers.",
      "Add a pitch or contact link if you take freelance work.",
    ],
    profile: {
      username: "writerexample",
      display_name: "Sam Okonkwo",
      bio: "Essays on cities, software and everything in between. Weekly-ish.",
      avatar_url: null,
      location: "Lagos, Nigeria",
      website_url: null,
    },
    links: [
      { id: "w1", title: "Subscribe to the newsletter", url: "https://example.substack.com", platform: "website" },
      { id: "w2", title: "Essay archive", url: "https://example.com/archive", platform: "website" },
      { id: "w3", title: "Bluesky", url: "https://bsky.app/profile/example", platform: "website" },
      { id: "w4", title: "Pitch me", url: "https://example.com/contact", platform: "website" },
    ],
  },
];

function ExamplesPage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid size-8 place-items-center rounded-full border border-primary/40 text-primary">
            ◎
          </span>
          LinkOrbit
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
        <section className="mx-auto w-full max-w-3xl px-5 pb-6 pt-8 text-center">
          <h1 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
            Link in bio examples
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Three ways to lay out a link in bio page — for developers, artists and writers. Each one
            is a real LinkOrbit layout, so you can copy the structure and swap in your own links.
          </p>
        </section>

        {EXAMPLES.map((ex, i) => (
          <section
            key={ex.slug}
            className="mx-auto w-full max-w-6xl px-5 py-12"
            aria-labelledby={`example-${ex.slug}`}
          >
            <div
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Example {i + 1}
                </p>
                <h2
                  id={`example-${ex.slug}`}
                  className="mt-3 font-display text-2xl font-semibold sm:text-3xl"
                >
                  {ex.audience} link in bio
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {ex.summary}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {ex.tips.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <PhoneFrame>
                  <PublicProfileView profile={ex.profile} links={ex.links} compact />
                </PhoneFrame>
              </div>
            </div>
          </section>
        ))}

        <section className="mx-auto w-full max-w-4xl px-5 py-16">
          <div className="rounded-3xl glass-strong px-6 py-12 text-center sm:px-12">
            <h2 className="text-balance font-display text-2xl font-semibold sm:text-3xl">
              Build your own in two minutes
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
              Claim your username, add your links, publish. That's the whole thing.
            </p>
            <Button asChild size="lg" className="mt-7">
              <Link to="/auth" search={{ mode: "signup" }}>
                Create your LinkOrbit
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-8 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} LinkOrbit</p>
        <div className="flex items-center gap-4">
          <Link to="/connect" className="hover:text-foreground">
            Connect an AI assistant
          </Link>
          <span className="hidden sm:inline">One link. Everything around you.</span>
        </div>
      </footer>
    </div>
  );
}
