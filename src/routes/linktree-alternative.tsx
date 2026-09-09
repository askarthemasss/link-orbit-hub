import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";

const TITLE = "Free Linktree Alternative for Developers & Creators — LTReee";
const DESCRIPTION =
  "LTReee is a free Linktree alternative: one clean link in bio page with embeddable link widgets, click analytics, private links and a developer project showcase.";
const URL = "https://ltreee.app/linktree-alternative";

const ROWS: { feature: string; ltreee: string }[] = [
  { feature: "Clean URL", ltreee: "ltreee.app/yourname" },
  { feature: "Price", ltreee: "Free" },
  { feature: "Embeddable link widget", ltreee: "Yes — iframe for any site" },
  { feature: "Click and view analytics", ltreee: "Yes, per link" },
  { feature: "Private links", ltreee: "Yes, sign-in only" },
  { feature: "Developer project showcase", ltreee: "Yes — Developer's Arena" },
  { feature: "Contact privacy", ltreee: "Email and phone are opt-in" },
  { feature: "Theme", ltreee: "Dark by default, light available" },
];

export const Route = createFileRoute("/linktree-alternative")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "linktree alternative, free linktree alternative, linktree competitor, link in bio app, link app, bio link tool, beacons alternative, bio.link alternative, carrd alternative, best link in bio, link in bio with analytics, embeddable links widget",
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
              publisher: { "@type": "Organization", name: "LTReee", url: "https://ltreee.app/" },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://ltreee.app/" },
                { "@type": "ListItem", position: 2, name: "Linktree alternative", item: URL },
              ],
            },
            {
              "@type": "SoftwareApplication",
              name: "LTReee",
              applicationCategory: "WebApplication",
              operatingSystem: "Any",
              url: "https://ltreee.app/",
              description: DESCRIPTION,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
          ],
        }),
      },
    ],
  }),
  component: AlternativePage,
});

function AlternativePage() {
  return (
    <MarketingLayout>
      <article>
        <h1 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
          A free Linktree alternative built for people who ship
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          LTReee gives you the same one-link-for-everything idea, without the upsells: a fast,
          dark-by-default link in bio page at <code>ltreee.app/yourname</code>, with analytics,
          embeddable widgets and a dedicated space for your projects.
        </p>

        <h2 className="mt-10 font-display text-2xl font-semibold">What you get</h2>
        <div className="mt-4 overflow-hidden rounded-2xl glass">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">LTReee link in bio features</caption>
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium">Feature</th>
                <th scope="col" className="px-4 py-3 font-medium">LTReee</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-border/60 last:border-0">
                  <th scope="row" className="px-4 py-3 font-normal text-muted-foreground">
                    {row.feature}
                  </th>
                  <td className="px-4 py-3">{row.ltreee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 font-display text-2xl font-semibold">Why switch</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>• Embed your links straight into your own portfolio with a copy-paste iframe.</li>
          <li>• See which links people actually click, inside and outside the embed.</li>
          <li>• Keep sensitive links behind sign-in instead of deleting them.</li>
          <li>• Show projects with live demos and repositories, not just a list of URLs.</li>
        </ul>

        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          New to the idea? Start with{" "}
          <Link to="/link-in-bio" className="text-primary underline-offset-4 hover:underline">
            what a link in bio page is
          </Link>
          , or browse a{" "}
          <Link to="/examples" className="text-primary underline-offset-4 hover:underline">
            real example page
          </Link>
          .
        </p>
      </article>
    </MarketingLayout>
  );
}
