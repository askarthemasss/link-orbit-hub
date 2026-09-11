import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Eye, EyeOff, ExternalLink, Loader2, Pencil, Plus, Rocket, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProjectFormDialog } from "@/components/dashboard/ProjectFormDialog";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useLTReee";
import { useProjectMutations, useProjects, type ProjectRow } from "@/hooks/useProjects";
import { getArenaStats, type ArenaStats } from "@/lib/arena-stats.functions";
import { profileUrl } from "@/lib/site-url";

export const Route = createFileRoute("/_authenticated/arena")({
  head: () => ({
    meta: [
      { title: "Developer's Arena — LTReee" },
      {
        name: "description",
        content: "Add the projects you have built and showcase them in your Developer's Arena.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ArenaEditorPage,
});

function ArenaEditorPage() {
  const profileQuery = useProfile();
  const profile = profileQuery.data;
  const projectsQuery = useProjects(profile?.id);
  const mutations = useProjectMutations(profile?.id);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const statsQuery = useQuery<ArenaStats>({
    queryKey: ["arena-stats"],
    queryFn: () => getArenaStats(),
  });
  const viewsByProject = new Map(
    (statsQuery.data?.topProjects ?? []).map((p) => [p.projectId, p.views]),
  );

  const projects = projectsQuery.data ?? [];

  function move(index: number, direction: -1 | 1) {
    const next = [...projects];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    mutations.reorder.mutate(next);
  }

  if (profileQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="grid place-items-center py-24 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl glass p-8 text-center">
          <h1 className="font-display text-xl font-semibold">Claim your link first</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick a username on your dashboard, then come back to build your Arena.
          </p>
          <Button asChild className="mt-5">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Developer&apos;s Arena</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Showcase what you have shipped. Visitors reach it from the Arena tab on your page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" asChild>
            <a href={`/${profile.username}?view=arena`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" aria-hidden="true" />
              View live
            </a>
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add project
          </Button>
        </div>
      </div>

      <p className="mb-6 truncate text-xs text-muted-foreground">
        {profileUrl(profile.username)}?view=arena
      </p>

      <section className="space-y-3" aria-label="Your projects">
        {projectsQuery.isLoading ? (
          <div className="grid place-items-center py-16 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-5 py-14 text-center">
            <Rocket className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
            <p className="mt-4 font-medium">No projects yet</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Add your first project — a title, what it does, a demo link and the code. It appears
              on your page under an Arena tab.
            </p>
            <Button
              className="mt-5"
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add your first project
            </Button>
          </div>
        ) : (
          projects.map((project, index) => (
            <div
              key={project.id}
              className="flex flex-col gap-3 rounded-2xl glass p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{project.title}</p>
                  {!project.is_visible ? (
                    <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                      Hidden
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {project.demo_url || project.repo_url || "No links yet"}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Move down"
                  disabled={index === projects.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={project.is_visible ? "Hide project" : "Show project"}
                  onClick={() =>
                    mutations.update.mutate({ id: project.id, is_visible: !project.is_visible })
                  }
                >
                  {project.is_visible ? (
                    <Eye className="size-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="size-4" aria-hidden="true" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Edit project"
                  onClick={() => {
                    setEditing(project);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Delete project"
                  onClick={async () => {
                    await mutations.remove.mutateAsync(project.id);
                    toast.success("Project removed");
                  }}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))
        )}
      </section>

      <ProjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editing}
        onSubmit={async (value) => {
          if (editing) {
            await mutations.update.mutateAsync({ id: editing.id, ...value });
            toast.success("Project updated");
          } else {
            await mutations.create.mutateAsync({ ...value, display_order: projects.length });
            toast.success("Project added");
          }
        }}
      />
    </DashboardLayout>
  );
}
