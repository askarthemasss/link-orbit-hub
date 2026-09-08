import { useEffect, useState } from "react";
import { ArrowUpRight, Code2, Github, Rocket } from "lucide-react";
import { SpaceScene } from "@/components/SpaceScene";
import { coverSrc } from "@/lib/project-cover";
import { prettyUrl } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import type { PublicProject } from "@/lib/public-profile.functions";

const isSafeHttpUrl = (u: string | null | undefined) => Boolean(u && /^https?:\/\//i.test(u.trim()));

type TrackKind = "view" | "demo_click" | "repo_click";

function track(username: string, kind: TrackKind, projectIds: string[]) {
  if (projectIds.length === 0) return;
  try {
    void fetch("/api/public/project-event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, kind, projectIds }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Tracking must never break navigation.
  }
}

function ProjectCard({
  project,
  onOpen,
  index,
}: {
  project: PublicProject;
  onOpen: (kind: "demo_click" | "repo_click") => void;
  index: number;
}) {
  const cover = coverSrc(project.cover_path);
  const demo = isSafeHttpUrl(project.demo_url) ? project.demo_url! : null;
  const repo = isSafeHttpUrl(project.repo_url) ? project.repo_url! : null;

  return (
    <article
      className="group relative overflow-hidden rounded-2xl glass transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:glow-ring"
      style={{ animation: `fade-in 0.5s ease-out ${Math.min(index * 80, 480)}ms both` }}
    >
      {cover ? (
        <div className="aspect-[16/9] w-full overflow-hidden bg-secondary/40">
          <img
            src={cover}
            alt={`${project.title} cover`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      ) : null}

      <div className="p-5">
        <h3 className="font-display text-base font-semibold">{project.title}</h3>
        {project.description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        ) : null}

        {project.tags.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 8).map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border px-2.5 py-0.5 text-[0.7rem] text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {demo || repo ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {demo ? (
              <Button asChild size="sm">
                <a
                  href={demo}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={() => onOpen("demo_click")}
                >
                  <Rocket className="size-3.5" aria-hidden="true" />
                  Live demo
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </Button>
            ) : null}
            {repo ? (
              <Button asChild size="sm" variant="secondary">
                <a
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={() => onOpen("repo_click")}
                >
                  <Github className="size-3.5" aria-hidden="true" />
                  Code
                </a>
              </Button>
            ) : null}
          </div>
        ) : null}

        {demo ? (
          <p className="mt-3 truncate text-xs text-muted-foreground">{prettyUrl(demo)}</p>
        ) : null}
      </div>
    </article>
  );
}

export function ArenaView({
  username,
  displayName,
  projects,
  trackViews = true,
  headingLevel = "h1",
}: {
  username: string;
  displayName: string;
  projects: PublicProject[];
  trackViews?: boolean;
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (!trackViews || projects.length === 0) return;
    const key = `ltreee-arena-view:${username}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Private mode — still count the visit once per page load.
    }
    track(
      username,
      "view",
      projects.map((p) => p.id),
    );
  }, [username, projects, trackViews]);

  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-border">
      {ready ? <SpaceScene /> : null}

      <div className="relative px-5 py-12 sm:px-8 sm:py-16">
        <header className="text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
            <Code2 className="size-3.5 text-primary" aria-hidden="true" />
            Developer&apos;s Arena
          </p>
          <Heading className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
            {displayName || `@${username}`}&apos;s work
          </Heading>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Projects shipped, demos you can open, and the code behind them.
          </p>
        </header>

        {projects.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No projects here yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onOpen={(kind) => track(username, kind, [project.id])}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
