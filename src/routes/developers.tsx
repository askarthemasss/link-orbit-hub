import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";

const TITLE = "Developer Portfolio Link Page — Developer's Arena on LTReee";
const DESCRIPTION =
  "Showcase your projects with live demos, repositories and click tracking. The Developer's Arena turns your LTReee link in bio page into a developer portfolio in minutes.";
const URL = "https://ltreee.app/developers";

const FAQ = [
  {
    q: "Is the Developer's Arena free?",
    a: "Yes. Creating a profile, adding projects and sharing your Arena link is free on LTReee.",
  },
  {
    q: "Do my Arena projects show up in Google?",
    a: "Yes. Arena pages are server-rendered with their own title, description and structured data, and they are submitted to Google Search Console through our sitemap.",
  },
  {
    q: "Can I track which projects get attention?",
    a: "Yes. LTReee tracks views, live-demo opens and repository clicks per project, so you can see which work drives real traffic.",
  },
  {
    q: "Do I need to give up my existing link page?",
    a: "No. The Arena lives behind your normal LTReee profile as a tab — visitors can switch between your links and your projects from the same ltreee.app/username URL.",
  },
];

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "developer portfolio, developer link in bio, github portfolio page, project showcase, side project showcase, dev portfolio link, indie hacker portfolio, showcase side projects, developer links page, link app for developers, linktree alternative for developers, developer profile page",
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
            {
              "@type": "FAQPage",
              mainEntity: FAQ.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "HowTo",
              name: "How to showcase your projects on LTReee",
              description: "Create a developer portfolio page with your projects in a few minutes.",
              step: [
                { "@type": "HowToStep", position: 1, name: "Create a profile", text: "Sign up free on LTReee and claim your username." },
                { "@type": "HowToStep", position: 2, name: "Add projects", text: "Open the Arena tab and add each project with a title, description, live demo and repository link." },
                { "@type": "HowToStep", position: 3, name: "Publish and share", text: "Publish your profile and share ltreee.app/yourname?view=arena everywhere." },
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

const STORIES = [
  {
    title: "The indie hacker",
    body: "Ships a new side project every few months. Instead of rewriting a portfolio site each time, they add a project to their Arena with the demo and GitHub links, then watch the click counts tell them which idea is worth doubling down on.",
  },
  {
    title: "The job-hunting developer",
    body: "Puts one Arena link on their résumé and LinkedIn. Recruiters land on a page of real, running projects with live demos — and the owner can see when a demo actually gets opened after an application.",
  },
  {
    title: "The open-source maintainer",
    body: "Maintains several repositories. The Arena keeps every repo, docs site and demo in one place, ordered by priority, with analytics showing which projects the community actually explores.",
  },
];

const COMPARISON = [
  {
    aspect: "Built for",
    ltreee: "Developers: projects, demos, repos and analytics",
    linktree: "General audiences: simple lists of links",
  },
  {
    aspect: "Project pages",
    ltreee: "Rich cards with cover, description, demo and repository",
    linktree: "A title and a URL per link",
  },
  {
    aspect: "Analytics",
    ltreee: "Per-project views, demo opens and repo clicks",
    linktree: "Link click counts (mostly paid tiers)",
  },
  {
    aspect: "Design",
    ltreee: "Cinematic space scene — your projects as a constellation",
    linktree: "Standard stacked buttons and themes",
  },
  {
    aspect: "SEO",
    ltreee: "Server-rendered pages with structured data, submitted to Google",
    linktree: "Limited control over indexing and metadata",
  },
];

const STEPS = [
  {
    title: "Create your free profile",
    body: "Sign up with Google or email and claim your username — that becomes your public ltreee.app/username address.",
  },
  {
    title: "Open the Arena tab",
    body: "From your dashboard, open Developer's Arena and add a project: title, a short description, a cover image, the live demo URL and the repository URL.",
  },
  {
    title: "Order and curate",
    body: "Drag your strongest work to the top and hide anything in progress — only visible projects appear publicly.",
  },
  {
    title: "Publish and share",
    body: "Publish your profile, then share ltreee.app/yourname?view=arena in your résumé, GitHub README and social bios. Watch views and clicks come in from your dashboard.",
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

        <h2 className="mt-12 font-display text-2xl font-semibold">How to submit a project</h2>
        <ol className="mt-5 space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl glass p-5">
              <h3 className="text-sm font-semibold">
                <span className="mr-2 text-primary">{i + 1}.</span>
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>

        <h2 className="mt-12 font-display text-2xl font-semibold">Who the Arena is for</h2>
        <div className="mt-5 space-y-4">
          {STORIES.map((s) => (
            <div key={s.title} className="rounded-2xl glass p-5">
              <h3 className="text-sm font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-semibold">
          Why developers choose LTReee over Linktree
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Linktree is a good generic link list. The Arena is built specifically for showcasing
          technical work — here&apos;s how they compare:
        </p>
        <div className="mt-5 overflow-x-auto rounded-2xl glass">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/60">
                <th className="p-4 font-semibold"> </th>
                <th className="p-4 font-semibold text-primary">LTReee Arena</th>
                <th className="p-4 font-semibold text-muted-foreground">Linktree</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.aspect} className="border-b border-border/40 last:border-0">
                  <th className="p-4 align-top font-medium">{row.aspect}</th>
                  <td className="p-4 align-top">{row.ltreee}</td>
                  <td className="p-4 align-top text-muted-foreground">{row.linktree}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-display text-2xl font-semibold">Frequently asked questions</h2>
        <dl className="mt-5 space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-2xl glass p-5">
              <dt className="text-sm font-semibold">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 rounded-2xl glass p-6 text-center">
          <h2 className="font-display text-xl font-semibold">Put your projects in orbit</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Create your free LTReee profile and publish your Arena in minutes.
          </p>
          <Link
            to="/auth"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start building free
          </Link>
        </div>

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
