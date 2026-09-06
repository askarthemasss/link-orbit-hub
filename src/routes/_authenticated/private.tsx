import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, ExternalLink, Loader2, Lock, LockOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LinkFormDialog } from "@/components/dashboard/LinkFormDialog";
import { EmptyOrbitIcon } from "@/components/EmptyOrbitIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { platformIcon } from "@/lib/platforms";
import { prettyUrl } from "@/lib/validation";
import { useLinkMutations, useLinks, useProfile, type LinkRow } from "@/hooks/useLTReee";

export const Route = createFileRoute("/_authenticated/private")({
  head: () => ({
    meta: [
      { title: "Private links — LTReee" },
      {
        name: "description",
        content: "Your personal, sign-in only links. Never shown on your public page.",
      },
      { property: "og:title", content: "Private links — LTReee" },
      {
        property: "og:description",
        content: "Your personal, sign-in only links. Never shown on your public page.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrivatePage,
});

function PrivatePage() {
  const profileQuery = useProfile();
  const profileId = profileQuery.data?.id;
  const linksQuery = useLinks(profileId);
  const mutations = useLinkMutations(profileId);

  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LinkRow | null>(null);
  const [deleting, setDeleting] = useState<LinkRow | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const privateLinks = useMemo(() => {
    const all = (linksQuery.data ?? []).filter((l) => l.is_private);
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (l) => l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q),
    );
  }, [linksQuery.data, query]);

  async function copy(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("Link copied");
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  const loading = profileQuery.isLoading || linksQuery.isLoading;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 font-display text-2xl font-semibold">
              <Lock className="size-5 text-primary" aria-hidden="true" />
              Private links
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              A quick place for your own links. Only you can see these — they never appear on your
              public page or in embeds.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            disabled={!profileId}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add private link
          </Button>
        </div>

        {!loading && (linksQuery.data ?? []).some((l) => l.is_private) ? (
          <div className="mt-6">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your private links"
              aria-label="Search your private links"
            />
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 grid place-items-center py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading</span>
          </div>
        ) : !profileId ? (
          <div className="mt-6 rounded-2xl glass px-5 py-12 text-center">
            <EmptyOrbitIcon className="mx-auto size-12" />
            <p className="mt-4 font-display text-lg font-semibold">Claim your link first</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Set up your page in the editor, then keep private links here.
            </p>
          </div>
        ) : privateLinks.length === 0 ? (
          <div className="mt-6 rounded-2xl glass px-5 py-12 text-center">
            <EmptyOrbitIcon className="mx-auto size-12" />
            <p className="mt-4 font-display text-lg font-semibold">
              {query ? "Nothing matches that search" : "Your private space is empty"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query
                ? "Try a different word."
                : "Save the links you use often — dashboards, docs, tools. Only you will see them."}
            </p>
            {query ? null : (
              <Button
                className="mt-5"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add your first private link
              </Button>
            )}
          </div>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {privateLinks.map((link) => {
              const Icon = platformIcon(link.platform);
              return (
                <li
                  key={link.id}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card/60 p-4"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-w-0 items-center gap-3"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary/70 text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium group-hover:underline">
                        {link.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {prettyUrl(link.url)}
                      </span>
                    </span>
                    <ExternalLink
                      className="ml-auto size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </a>
                  <div className="flex items-center justify-end gap-0.5">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={copiedId === link.id ? "Copied" : `Copy ${link.title} link`}
                      onClick={() => void copy(link.url, link.id)}
                    >
                      {copiedId === link.id ? (
                        <Check className="size-4 text-green-500" aria-hidden="true" />
                      ) : (
                        <Copy className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Move ${link.title} to your public page`}
                      onClick={async () => {
                        await mutations.update.mutateAsync({ id: link.id, is_private: false });
                        toast.success("Moved to your public page");
                      }}
                    >
                      <LockOpen className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Edit ${link.title}`}
                      onClick={() => {
                        setEditing(link);
                        setFormOpen(true);
                      }}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${link.title}`}
                      onClick={() => setDeleting(link)}
                    >
                      <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <LinkFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={
          editing ? { title: editing.title, url: editing.url, platform: editing.platform } : undefined
        }
        onSubmit={async (value) => {
          try {
            if (editing) {
              await mutations.update.mutateAsync({ id: editing.id, ...value });
              toast.success("Link updated");
            } else {
              await mutations.create.mutateAsync({
                ...value,
                display_order: (linksQuery.data ?? []).length,
                is_private: true,
              });
              toast.success("Private link saved");
            }
            setFormOpen(false);
          } catch {
            toast.error("We couldn't save that link. Please try again.");
          }
        }}
      />

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this private link?</AlertDialogTitle>
            <AlertDialogDescription>“{deleting?.title}” will be removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleting) return;
                try {
                  await mutations.remove.mutateAsync(deleting.id);
                  toast.success("Link deleted");
                } catch {
                  toast.error("We couldn't delete that link.");
                }
                setDeleting(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
