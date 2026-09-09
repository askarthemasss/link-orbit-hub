import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";

const TITLE = "What Is a Link in Bio? How to Make One Free (2026 Guide)";
const DESCRIPTION =
  "A link in bio page puts your website, socials, projects and contact details behind one shareable URL. Learn what it is, why it works and how to build one free with LTReee.";
const URL = "https://ltreee.app/link-in-bio";

export const Route = createFileRoute("/link-in-bio")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "link in bio, what is a link in bio, link in bio page, bio link, link app, links app, link tree, one link for all socials, instagram bio link, tiktok link in bio, free link in bio, bio link generator, link hub, micro website, personal landing page",
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
              "@type": "Article",
              headline: TITLE,
              description: DESCRIPTION,
              mainEntityOfPage: URL,
              author: { "@type": "Organization", name: "LTReee", url: "https://ltreee.app/" },
              publisher: { "@type": "Organization", name: "LTReee", url: "https://ltreee.app/" },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://ltreee.app/" },
                { "@type": "ListItem", position: 2, name: "What is a link in bio", item: URL },
              ],
            },
            {
              "@type": "HowTo",
              name: "How to make a link in bio page",
              step: [
                { "@type": "HowToStep", name: "Claim a username", text: "Sign up free and pick your ltreee.app/username." },
                { "@type": "HowToStep", name: "Add your links", text: "Add your website, socials, projects and contact links, then order them." },
                { "@type": "HowToStep", name: "Publish and share", text: "Publish your page and paste the single link into every bio you own." },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: LinkInBioPage,
});

function LinkInBioPage() {
  return (
    <MarketingLayout>
      <article className="prose-invert max-w-none">
        <h1 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
          What is a link in bio page?
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          A link in bio page is a single web page that holds every link you want people to find:
          your website, portfolio, GitHub, LinkedIn, YouTube, shop, résumé and contact details.
          Social platforms usually allow one clickable URL in your profile, so you put your link in
          bio page there and let it do the rest of the work.
        </p>

        <h2 className="mt-10 font-display text-2xl font-semibold">Why people use a links app</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>• One URL works across Instagram, X, TikTok, LinkedIn, YouTube and email signatures.</li>
          <li>• You change a link once instead of editing every profile you own.</li>
          <li>• Visitors get a fast, mobile-first page instead of a wall of raw URLs.</li>
          <li>• You can see what people actually click and drop what does not work.</li>
        </ul>

        <h2 className="mt-10 font-display text-2xl font-semibold">
          How to make a link in bio page free
        </h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <li>
            <strong className="text-foreground">1. Claim your username.</strong> Sign up and pick
            your address — it becomes <code>ltreee.app/yourname</code>.
          </li>
          <li>
            <strong className="text-foreground">2. Add your links.</strong> Add each link with a
            clear title, drag them into the order that matters, and hide anything private.
          </li>
          <li>
            <strong className="text-foreground">3. Publish and share.</strong> Publish, copy your
            link, and paste it into every bio, résumé and business card you have.
          </li>
        </ol>

        <h2 className="mt-10 font-display text-2xl font-semibold">What makes a good bio link page</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Keep it short. Three to seven links usually outperform twenty. Lead with the one thing you
          want people to open, use plain titles instead of clever ones, and make sure it loads
          instantly on a phone. See a real layout on the{" "}
          <Link to="/examples" className="text-primary underline-offset-4 hover:underline">
            link in bio examples
          </Link>{" "}
          page, or read how LTReee compares as a{" "}
          <Link to="/linktree-alternative" className="text-primary underline-offset-4 hover:underline">
            Linktree alternative
          </Link>
          .
        </p>

        <h2 className="mt-10 font-display text-2xl font-semibold">Built for developers too</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          If you ship projects, the{" "}
          <Link to="/developers" className="text-primary underline-offset-4 hover:underline">
            Developer&apos;s Arena
          </Link>{" "}
          turns your page into a project showcase with live demos, repositories and click tracking.
        </p>
      </article>
    </MarketingLayout>
  );
}
