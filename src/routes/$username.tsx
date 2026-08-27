import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublicProfileView } from "@/components/PublicProfileView";
import { getPublicProfile } from "@/lib/public-profile.functions";
import { profileUrl } from "@/lib/site-url";

export const Route = createFileRoute("/$username")({
  loader: async ({ params }) => {
    const profile = await getPublicProfile({ data: { username: params.username } });
    if (!profile) throw notFound();
    return { profile };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Page not found — LinkOrbit" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { profile } = loaderData;
    const name = profile.display_name || `@${profile.username}`;
    const description = profile.bio || `All of ${name}'s links in one place, on LinkOrbit.`;
    const url = profileUrl(profile.username);
    const sameAs = (profile.links ?? []).map((link) => link.url).filter(Boolean);
    return {
      meta: [
        { title: `${name} — LinkOrbit` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} — LinkOrbit` },
        { property: "og:description", content: description },
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
  return <PublicProfileView profile={profile} links={profile.links} />;
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
            Create your LinkOrbit
          </Link>
        </div>
      </div>
    </main>
  );
}
