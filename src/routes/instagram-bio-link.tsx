import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";

const TITLE = "How to Add a Link in Your Instagram Bio (2026) | LTReee";
const DESCRIPTION =
  "Step-by-step: add a clickable link to your Instagram bio, and use one link in bio page for Instagram, TikTok and YouTube so every link stays in one place.";
const URL = "https://ltreee.app/instagram-bio-link";

const STEPS = [
  {
    name: "Create your link page",
    text: "Sign up free on LTReee, claim your username and add every link you want people to reach.",
  },
  {
    name: "Copy your link",
    text: "Your page lives at ltreee.app/yourname. Copy it from your dashboard with one tap.",
  },
  {
    name: "Open Instagram and edit your profile",
    text: "Go to your profile, tap Edit profile, then tap Links and choose Add external link.",
  },
  {
    name: "Paste and save",
    text: "Paste your LTReee URL, give it a short title such as 'All my links', and save.",
  },
];

export const Route = createFileRoute("/instagram-bio-link")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "instagram bio link, link in bio instagram, how to add link to instagram bio, clickable link instagram bio, instagram link in bio free, tiktok link in bio, youtube bio link, one link for all socials, bio link for instagram, instagram profile link, multiple links instagram bio",
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
                { "@type": "ListItem", position: 2, name: "Instagram bio link", item: URL },
              ],
            },
            {
              "@type": "HowTo",
              name: "How to add a link in your Instagram bio",
              step: STEPS.map((s) => ({
                "@type": "HowToStep",
                name: s.name,
                text: s.text,
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: InstagramBioLinkPage,
});

function InstagramBioLinkPage() {
  return (
    <MarketingLayout>
      <article className="max-w-none">
        <h1 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
          How to add a link in your Instagram bio
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Instagram gives you a small number of link slots in your profile, and nothing clickable in
          captions. The usual fix is one link in bio page that holds everything else — your shop,
          your latest video, your portfolio, your newsletter — so you never have to swap the link
          again.
        </p>

        <h2 className="mt-10 font-display text-2xl font-semibold">Step by step</h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          {STEPS.map((s, i) => (
            <li key={s.name}>
              <strong className="text-foreground">
                {i + 1}. {s.name}.
              </strong>{" "}
              {s.text}
            </li>
          ))}
        </ol>

        <h2 className="mt-10 font-display text-2xl font-semibold">
          Use the same link on TikTok, YouTube and X
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          The page is just a URL, so it drops into a TikTok bio, a YouTube channel description, an X
          profile, a LinkedIn contact field or an email signature. Change a destination once in your
          dashboard and every platform is updated at the same moment.
        </p>

        <h2 className="mt-10 font-display text-2xl font-semibold">What to put on the page</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
          <li>• The one thing you are promoting right now, at the very top.</li>
          <li>• Three to seven links total — long lists get ignored.</li>
          <li>• Plain titles: "Shop", "Latest video", "Book a call".</li>
          <li>• Contact details only if you want them public; they are off by default.</li>
        </ul>

        <h2 className="mt-10 font-display text-2xl font-semibold">Is it free?</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Yes — see what is included on the{" "}
          <Link to="/free-link-in-bio" className="text-primary underline-offset-4 hover:underline">
            free link in bio
          </Link>{" "}
          page, or look at a{" "}
          <Link to="/examples" className="text-primary underline-offset-4 hover:underline">
            finished example
          </Link>{" "}
          first.
        </p>
      </article>
    </MarketingLayout>
  );
}
