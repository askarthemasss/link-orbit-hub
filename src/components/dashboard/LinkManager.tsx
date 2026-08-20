import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Copy, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { LinkFormDialog, type LinkFormValue } from "./LinkFormDialog";
import { platformIcon } from "@/lib/platforms";
import { prettyUrl } from "@/lib/validation";
import type { LinkRow } from "@/hooks/useLinkOrbit";


export function LinkManager({
  links,
  loading,
  onCreate,
  onUpdate,
  onDelete,
  onReorder,
}: {
  links: LinkRow[];
  loading: boolean;
  onCreate: (value: LinkFormValue) => Promise<void>;
  onUpdate: (id: string, value: Partial<LinkRow>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (ordered: LinkRow[]) => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LinkRow | null>(null);
  const [deleting, setDeleting] = useState<LinkRow | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function move(from: number, to: number) {
    if (to < 0 || to >= links.length) return;
    const next = [...links];
    const [item] = next.splice(from, 1);
    if (!item) return;
    next.splice(to, 0, item);
    onReorder(next);
  }

  async function copyLink(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("Link copied");
      setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  }

  return (
    <section className="rounded-2xl glass p-5 sm:p-6" aria-labelledby="links-heading">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id="links-heading" className="text-base font-semibold">
          Links
        </h2>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add link
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary/50" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
          <EmptyOrbitIcon className="mx-auto size-12" />
          <p className="mt-4 font-display text-lg font-semibold">Add your first link</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your public page will show links here once you add them.
          </p>
          <Button
            className="mt-5"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add your first link
          </Button>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {links.map((link, index) => {
            const Icon = platformIcon(link.platform);
            return (
              <li
                key={link.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex !== null && dragIndex !== index) move(dragIndex, index);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
                className={`flex items-center gap-3 rounded-xl border border-border bg-card/60 px-3 py-3 transition-colors ${
                  dragIndex === index ? "opacity-60" : ""
                } ${link.is_active ? "" : "opacity-60"}`}
              >
                <GripVertical className="hidden size-4 shrink-0 cursor-grab text-muted-foreground sm:block" aria-hidden="true" />
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary/70 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{link.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{prettyUrl(link.url)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Move ${link.title} up`}
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                  >
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Move ${link.title} down`}
                    disabled={index === links.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </Button>
                  <Switch
                    checked={link.is_active}
                    aria-label={`${link.is_active ? "Hide" : "Show"} ${link.title} on your profile`}
                    onCheckedChange={(checked) => void onUpdate(link.id, { is_active: checked })}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={copiedId === link.id ? "Copied" : `Copy ${link.title} link`}
                    onClick={() => void copyLink(link.url, link.id)}
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

      <LinkFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={
          editing ? { title: editing.title, url: editing.url, platform: editing.platform } : undefined
        }
        onSubmit={async (value) => {
          try {
            if (editing) {
              await onUpdate(editing.id, value);
              toast.success("Link updated");
            } else {
              await onCreate(value);
              toast.success("Link added");
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
            <AlertDialogTitle>Delete this link?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.title}” will be removed from your public profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleting) return;
                try {
                  await onDelete(deleting.id);
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
    </section>
  );
}
