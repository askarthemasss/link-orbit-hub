import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublicProfileView } from "@/components/PublicProfileView";
import { ArenaView } from "@/components/arena/ArenaView";
import { getPublicProfile } from "@/lib/public-profile.functions";
import { profileUrl } from "@/lib/site-url";

type ProfileSearch = { view?: "arena" };

export const Route = createFileRoute("/$username")({
  validateSearch: (search: Record<string, unknown>): ProfileSearch =>
    search["view"] === "arena" ? { view: "arena" } : {},
  loader: async ({ params }) => {
    const profile = await getPublicProfile({ data: { username: params.username } });
    if (!profile) throw notFound();
    return { profile };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Page not found — LTReee" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { profile } = loaderData;
    const name = profile.display_name || `@${profile.username}`;
    const description = profile.bio || `All of ${name}'s links in one place, on LTReee.`;
    const url = profileUrl(profile.username);
    const sameAs = (profile.links ?? []).map((link) => link.url).filter(Boolean);
    const projects = profile.projects ?? [];
    const fullDescription = projects.length
      ? `${description} Explore ${projects.length} project${projects.length === 1 ? "" : "s"} in their Developer's Arena.`
      : description;
    return {
      meta: [
        { title: `${name} — LTReee` },
        { name: "description", content: fullDescription },
        { property: "og:title", content: `${name} — LTReee` },
        { property: "og:description", content: fullDescription },
        { property: "og:type", content: "profile" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url,
            mainEntity: {
              "@type": "Person",
              name,
              alternateName: `@${profile.username}`,
              ...(profile.bio ? { description: profile.bio } : {}),
              ...(profile.location ? { address: profile.location } : {}),
              ...(sameAs.length ? { sameAs } : {}),
              ...(projects.length
                ? {
                    makesOffer: undefined,
                    subjectOf: projects.map((p) => ({
                      "@type": "CreativeWork",
                      name: p.title,
                      ...(p.description ? { description: p.description } : {}),
                      ...(p.demo_url ? { url: p.demo_url } : {}),
                    })),
                  }
                : {}),
            },
          }),
        },
      ],
    };
  },
  errorComponent: ProfileMissing,
  notFoundComponent: ProfileMissing,
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { profile } = Route.useLoaderData();
  const { view } = Route.useSearch();
  const projects = profile.projects ?? [];
  const hasArena = projects.length > 0;
  const active = hasArena && view === "arena" ? "arena" : "links";

  return (
    <div className="px-5 pt-8 sm:pt-10">
      {hasArena ? (
        <nav
          aria-label="Profile sections"
          className="mx-auto flex w-fit items-center gap-1 rounded-full glass p-1"
        >
          <Link
            to="/$username"
            params={{ username: profile.username }}
            search={{}}
            replace
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              active === "links" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Links
          </Link>
          <Link
            to="/$username"
            params={{ username: profile.username }}
            search={{ view: "arena" }}
            replace
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              active === "arena" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Arena
          </Link>
        </nav>
      ) : null}

      {active === "arena" ? (
        <div className="mx-auto mt-8 w-full max-w-4xl pb-16">
          <ArenaView
            username={profile.username}
            displayName={profile.display_name}
            projects={projects}
          />
        </div>
      ) : (
        <div className="-mx-5">
          <PublicProfileView profile={profile} links={profile.links} />
        </div>
      )}
    </div>
  );
}

function ProfileMissing() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 text-center">
      <div className="max-w-sm">
        <h1 className="font-display text-2xl font-semibold">Nothing in this orbit yet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This profile isn't published yet. If it's yours, publish it from your dashboard to make it public.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Publish settings
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Create your LTReee
          </Link>
        </div>
      </div>
    </main>
  );
}
