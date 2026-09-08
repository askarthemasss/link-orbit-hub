import { useEffect, useState } from "react";
import { ArrowUpRight, Github, Radio, Rocket } from "lucide-react";
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
      className="arena-project group relative min-h-72 overflow-hidden border border-arena-line bg-arena-panel/70 transition-all duration-500 hover:-translate-y-1 hover:border-arena-signal/60"
      style={{ animation: `fade-in 0.5s ease-out ${Math.min(index * 80, 480)}ms both` }}
    >
      <div className="arena-project-scan absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute left-0 top-0 size-2 border-l border-t border-arena-signal" />
      <div className="absolute bottom-0 right-0 size-2 border-b border-r border-arena-signal" />
      {cover ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-arena-line bg-arena-panel">
          <img
            src={cover}
            alt={`${project.title} cover`}
            loading="lazy"
            className="size-full object-cover opacity-70 grayscale transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-90 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-linear-to-t from-arena-panel to-transparent" />
        </div>
      ) : null}

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className="arena-node-mark grid size-11 shrink-0 place-items-center border border-arena-line bg-arena-void">
            <span className="size-3 rotate-45 border border-arena-signal" />
          </div>
          <div className="text-right font-arena text-[0.625rem] uppercase text-arena-dim">
            <p>Node {String(index + 1).padStart(2, "0")}</p>
            <p className="mt-1 text-arena-signal">Online</p>
          </div>
        </div>
        <h3 className="font-arena text-lg font-bold text-arena-bright transition-colors group-hover:text-arena-signal">
          {project.title}
        </h3>
        {project.description ? (
          <p className="mt-2 text-sm leading-relaxed text-arena-muted">{project.description}</p>
        ) : null}

        {project.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 8).map((tag) => (
              <li
                key={tag}
                className="border border-arena-line px-2 py-1 font-arena text-[0.625rem] uppercase text-arena-dim"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {demo || repo ? (
          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-arena-line pt-5">
            {demo ? (
              <Button asChild size="sm" className="rounded-sm bg-arena-bright text-arena-void hover:bg-arena-signal">
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
              <Button asChild size="sm" variant="outline" className="rounded-sm border-arena-line bg-transparent text-arena-bright hover:border-arena-signal hover:bg-arena-signal/10">
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
          <p className="mt-3 truncate font-arena text-[0.625rem] uppercase text-arena-dim">{prettyUrl(demo)}</p>
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
    <section className="arena-shell relative isolate min-h-[calc(100svh-2rem)] overflow-hidden bg-arena-void text-arena-bright">
      {ready ? <SpaceScene /> : null}

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pt-36 lg:px-12">
        <header className="grid min-h-[48svh] content-start gap-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="border-l-2 border-arena-signal/60 pl-5 sm:pl-7">
            <p className="flex items-center gap-3 font-arena text-[0.625rem] uppercase text-arena-signal sm:text-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-arena-signal opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-arena-signal" />
              </span>
              Live project circuit
            </p>
            <Heading className="mt-4 max-w-3xl font-arena text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              {displayName || `@${username}`}&apos;s
              <span className="block text-arena-muted">Developer&apos;s Arena</span>
            </Heading>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-arena-muted sm:text-base">
              Deployed work mapped across a living project constellation.
            </p>
          </div>
          <div className="hidden pt-3 text-right font-arena text-[0.625rem] uppercase text-arena-dim sm:block">
            <p>Observer / @{username}</p>
            <p className="mt-2">Sector / {String(projects.length).padStart(2, "0")}</p>
            <div className="mt-4 flex justify-end gap-2">
              <span className="h-px w-8 bg-arena-signal/30" />
              <span className="h-px w-20 bg-arena-signal" />
            </div>
          </div>
        </header>

        <div className="mb-8 flex items-center gap-3 font-arena text-[0.625rem] uppercase text-arena-dim">
          <Radio className="size-3.5 text-arena-signal" aria-hidden="true" />
          Project constellation
          <span className="h-px flex-1 bg-arena-line" />
          {String(projects.length).padStart(2, "0")} active
        </div>

        {projects.length === 0 ? (
          <p className="border border-arena-line bg-arena-panel/60 p-8 text-center text-sm text-arena-muted">
            No projects here yet.
          </p>
        ) : (
          <div className="arena-constellation relative grid gap-8 pb-12 md:grid-cols-2 lg:grid-cols-3">
            <svg aria-hidden="true" className="absolute inset-0 hidden size-full md:block" preserveAspectRatio="none">
              <path className="arena-path" d="M 0 34 C 190 34, 210 76, 420 76 S 650 18, 880 48 S 1090 82, 1440 38" />
              <path className="arena-path arena-path-delayed" d="M 80 100 C 280 65, 360 130, 560 96 S 900 74, 1180 115" />
            </svg>
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

        <footer className="grid grid-cols-2 gap-6 border-t border-arena-line pt-7 font-arena text-[0.625rem] uppercase text-arena-dim sm:grid-cols-4">
          <div><p>Projects</p><p className="mt-1 text-lg font-bold text-arena-bright">{String(projects.length).padStart(2, "0")}</p></div>
          <div><p>Signal</p><p className="mt-1 text-lg font-bold text-arena-signal">Stable</p></div>
          <div><p>Visibility</p><p className="mt-1 text-lg font-bold text-arena-bright">Public</p></div>
          <div><p>System</p><p className="mt-1 text-lg font-bold text-arena-bright">LTReee</p></div>
        </footer>
      </div>
    </section>
  );
}
