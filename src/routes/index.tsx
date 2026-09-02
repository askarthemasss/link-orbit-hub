import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Link2, Pencil, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PublicProfileView } from "@/components/PublicProfileView";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession } from "@/hooks/useSession";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LinkOrbit — One link. Everything around you." },
      {
        name: "description",
        content:
          "Bring your portfolio, socials, projects and everything you want to share into one simple profile. Free and ready in two minutes.",
      },
      { property: "og:title", content: "LinkOrbit — One link. Everything around you." },
      {
        property: "og:description",
        content: "One simple link for your portfolio, socials and projects.",
      },
    ],
  }),
  component: Landing,
});

const EXAMPLE_PROFILE = {
  username: "askar",
  display_name: "Mohamed Askar",
  bio: "Product engineer. Building small, useful things on the internet.",
  avatar_url: null,
  location: "Chennai, India",
  website_url: null,
};

const EXAMPLE_LINKS = [
  { id: "1", title: "Portfolio", url: "https://example.com", platform: "website" },
  { id: "2", title: "GitHub", url: "https://github.com/example", platform: "github" },
  { id: "3", title: "LinkedIn", url: "https://linkedin.com/in/example", platform: "linkedin" },
  { id: "4", title: "Latest talk", url: "https://youtube.com/@example", platform: "youtube" },
];

const STEPS = [
  { icon: Sparkles, title: "Create", body: "Claim your username and add a name, bio and photo." },
  { icon: Link2, title: "Add", body: "Drop in every link worth sharing and put them in order." },
  { icon: Share2, title: "Share", body: "Publish and paste your one link anywhere people find you." },
];

const BENEFITS = [
  { title: "One URL", body: "Everything you want people to find, behind a single address." },
  { title: "Easy to edit", body: "Change a link and your public page updates instantly." },
  { title: "Beautiful by default", body: "A professional profile without designing a website." },
  { title: "Share anywhere", body: "Social bios, resumes, emails, business cards, messages." },
];

function Landing() {
  const { isAuthenticated } = useSession();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid size-8 place-items-center rounded-full border border-primary/40 text-primary">
            <span className="size-2 rounded-full bg-primary" />
          </span>
          LinkOrbit
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button asChild size="sm">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Create your LinkOrbit
                </Link>
              </Button>
            </>
          )}
        </nav>
      </header>


      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-12 px-5 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              Your corner of the internet
            </p>
            <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient">One link.</span> Everything around you.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Bring your portfolio, socials, projects, and everything you want to share into one simple
              profile.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    Go to dashboard
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Create your LinkOrbit
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </Button>

              <Button asChild size="lg" variant="secondary">
                <a href="#example">Explore an example</a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Free. Set up in about two minutes.</p>
          </div>

          <div className="justify-self-center">
            <PhoneFrame>
              <PublicProfileView profile={EXAMPLE_PROFILE} links={EXAMPLE_LINKS} compact />
            </PhoneFrame>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-16" aria-labelledby="how">
          <h2 id="how" className="font-display text-2xl font-semibold sm:text-3xl">
            Create → Add → Share
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="rounded-2xl glass p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary/70 text-primary">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">
                  <span className="text-muted-foreground">{i + 1}. </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="example" className="mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-16" aria-labelledby="example-heading">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 id="example-heading" className="font-display text-2xl font-semibold sm:text-3xl">
                This is what people see
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                A calm, fast page built for phones first — because most people will open your link from a
                social app. No clutter, no noise, just the things you want found.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li>• Works beautifully with just two or three links</li>
                <li>• Loads instantly, even on slow connections</li>
                <li>• Large, comfortable touch targets</li>
              </ul>
            </div>
            <div className="justify-self-center">
              <PhoneFrame>
                <PublicProfileView profile={EXAMPLE_PROFILE} links={EXAMPLE_LINKS} compact />
              </PhoneFrame>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-16" aria-labelledby="why">
          <h2 id="why" className="font-display text-2xl font-semibold sm:text-3xl">
            Why LinkOrbit
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl glass p-6">
                <h3 className="text-base font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl px-5 py-16">
          <div className="rounded-3xl glass-strong px-6 py-12 text-center sm:px-12">
            <Pencil className="mx-auto size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-balance font-display text-2xl font-semibold sm:text-3xl">
              Build your corner of the internet
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
              Share one link. Let people find the rest.
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
          <Link to="/examples" className="hover:text-foreground">
            Link in bio examples
          </Link>
          <Link to="/connect" className="hover:text-foreground">
            Connect an AI assistant
          </Link>
          <span className="hidden sm:inline">One link. Everything around you.</span>
        </div>
      </footer>
    </div>
  );
}

