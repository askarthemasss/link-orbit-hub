import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";

const TITLE = "Developer Portfolio Link Page — Developer's Arena on LTReee";
const DESCRIPTION =
  "Showcase your projects with live demos, repositories and click tracking. The Developer's Arena turns your LTReee link in bio page into a developer portfolio in minutes.";
const URL = "https://ltreee.app/developers";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "developer portfolio, developer link in bio, github portfolio page, project showcase, side project showcase, dev portfolio link, indie hacker portfolio, showcase side projects, developer links page, link app for developers",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              name: TITLE,
              description: DESCRIPTION,
              url: URL,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://ltreee.app/" },
                { "@type": "ListItem", position: 2, name: "For developers", item: URL },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: DevelopersPage,
});

const FEATURES = [
  {
    title: "Projects with context",
    body: "Each project gets a title, description, cover, live demo and repository link — not a bare URL.",
  },
  {
    title: "A space that looks like one",
    body: "The Arena renders your work in a cinematic black-hole scene with your projects as connected nodes.",
  },
  {
    title: "Real numbers",
    body: "Track views, demo opens and repository clicks per project so you know what draws attention.",
  },
  {
    title: "Indexed by Google",
    body: "Your Arena is server-rendered with its own title, description and structured data.",
  },
];

function DevelopersPage() {
  return (
    <MarketingLayout>
      <article>
        <h1 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
          A developer portfolio behind one link
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          The Developer&apos;s Arena is LTReee&apos;s showcase for people who build. Add your
          projects once and share <code>ltreee.app/yourname?view=arena</code> — recruiters, clients
          and collaborators land on your work instead of a list of links.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl glass p-5">
              <h2 className="text-base font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-10 font-display text-2xl font-semibold">How to set it up</h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong className="text-foreground">1.</strong> Create your free LTReee profile and
            claim your username.
          </li>
          <li>
            <strong className="text-foreground">2.</strong> Open the Arena tab and add each project
            with its demo and repository links.
          </li>
          <li>
            <strong className="text-foreground">3.</strong> Publish, then share your Arena link in
            your résumé, GitHub profile and social bios.
          </li>
        </ol>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          Also worth reading:{" "}
          <Link to="/link-in-bio" className="text-primary underline-offset-4 hover:underline">
            what a link in bio page is
          </Link>{" "}
          and why LTReee works as a{" "}
          <Link to="/linktree-alternative" className="text-primary underline-offset-4 hover:underline">
            Linktree alternative
          </Link>
          .
        </p>
      </article>
    </MarketingLayout>
  );
}
