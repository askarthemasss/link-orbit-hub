import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";

const TITLE = "Free Link in Bio Page — No Paid Plan, No Ads | LTReee";
const DESCRIPTION =
  "Make a free link in bio page with your own ltreee.app/username. Unlimited links, click analytics, embeddable widgets and a dark theme — free, with no ads and no card.";
const URL = "https://ltreee.app/free-link-in-bio";

const INCLUDED = [
  "Your own clean address: ltreee.app/yourname",
  "Unlimited links, reordered however you like",
  "Click and view analytics on every link",
  "An embeddable links widget for your own website",
  "Private links only you see after signing in",
  "Opt-in email and phone contact chips",
  "Dark theme by default, light theme available",
  "A developer project showcase in the Arena",
];

export const Route = createFileRoute("/free-link-in-bio")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "free link in bio, free link in bio page, free bio link, free linktree, free link in bio without ads, free bio link generator, free links page, no cost link in bio, free link in bio for instagram, free link in bio for tiktok, free personal link page, create link in bio free",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large" },
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
                { "@type": "ListItem", position: 2, name: "Free link in bio", item: URL },
              ],
            },
            {
              "@type": "SoftwareApplication",
              name: "LTReee",
              applicationCategory: "WebApplication",
              operatingSystem: "Any",
              url: "https://ltreee.app/",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
          ],
        }),
      },
    ],
  }),
  component: FreeLinkInBioPage,
});

function FreeLinkInBioPage() {
  return (
    <MarketingLayout>
      <article className="max-w-none">
        <h1 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
          A free link in bio page, with nothing held back
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Most link in bio tools give you a page and then charge for the parts that matter:
          analytics, a clean URL, more than a handful of links. LTReee is free and keeps the useful
          pieces in the free tier. You sign up, pick a username, add links, and share one address.
        </p>

        <h2 className="mt-10 font-display text-2xl font-semibold">What you get for free</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {INCLUDED.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>

        <h2 className="mt-10 font-display text-2xl font-semibold">How long does setup take?</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          About two minutes. Sign in with Google or email, claim the username you want, paste in
          your links with plain titles, drag them into the order you care about, and publish. Your
          page is live at <code>ltreee.app/yourname</code> immediately and works on every phone.
        </p>

        <h2 className="mt-10 font-display text-2xl font-semibold">No ads on your page</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Your visitors see your links and nothing else — no banners, no upsell strip, no tracking
          pixels sold to someone else. The page loads fast because there is almost nothing on it
          besides what you put there.
        </p>

        <h2 className="mt-10 font-display text-2xl font-semibold">Where people put their link</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Instagram and TikTok bios, X and LinkedIn profiles, YouTube descriptions, email
          signatures, résumés, business cards, conference badges. One address, changed in one
          place. See a real layout on the{" "}
          <Link to="/examples" className="text-primary underline-offset-4 hover:underline">
            examples page
          </Link>
          , read{" "}
          <Link to="/link-in-bio" className="text-primary underline-offset-4 hover:underline">
            what a link in bio page is
          </Link>
          , or compare it as a{" "}
          <Link
            to="/linktree-alternative"
            className="text-primary underline-offset-4 hover:underline"
          >
            Linktree alternative
          </Link>
          .
        </p>
      </article>
    </MarketingLayout>
  );
}
