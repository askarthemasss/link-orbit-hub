import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useOwnerAvatarUrl } from "@/hooks/useOwnerAvatarUrl";
import { normalizeUrl } from "@/lib/validation";
import type { ProjectInput, ProjectRow } from "@/hooks/useProjects";

const MAX_BYTES = 4 * 1024 * 1024;

async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const max = 1200;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return await new Promise<Blob>((resolve) =>
    canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", 0.85),
  );
}

const emptyDraft = {
  title: "",
  description: "",
  demo_url: "",
  repo_url: "",
  tags: "",
  cover_path: null as string | null,
  is_visible: true,
};

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectRow | null;
  onSubmit: (value: ProjectInput) => Promise<void>;
}) {
  const [draft, setDraft] = useState(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const coverPreview = useOwnerAvatarUrl(draft.cover_path);

  useEffect(() => {
    if (!open) return;
    setDraft(
      project
        ? {
            title: project.title,
            description: project.description,
            demo_url: project.demo_url ?? "",
            repo_url: project.repo_url ?? "",
            tags: (project.tags ?? []).join(", "),
            cover_path: project.cover_path,
            is_visible: project.is_visible,
          }
        : emptyDraft,
    );
  }, [open, project]);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("That file isn't an image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Images must be under 4 MB.");
      return;
    }
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Not signed in");
      const blob = await compress(file);
      const path = `${user.id}/projects/cover-${Date.now()}.jpg`;
      const { error } = await supabase.storage.from("avatars").upload(path, blob, {
        contentType: "image/jpeg",
        upsert: true,
      });
      if (error) throw error;
      setDraft((d) => ({ ...d, cover_path: path }));
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const title = draft.title.trim();
    if (!title) {
      toast.error("Give your project a title.");
      return;
    }
    const demo = draft.demo_url.trim() ? normalizeUrl(draft.demo_url) : null;
    if (draft.demo_url.trim() && !demo) {
      toast.error("Enter a valid demo address starting with http:// or https://");
      return;
    }
    const repo = draft.repo_url.trim() ? normalizeUrl(draft.repo_url) : null;
    if (draft.repo_url.trim() && !repo) {
      toast.error("Enter a valid code address starting with http:// or https://");
      return;
    }
    setBusy(true);
    try {
      await onSubmit({
        title,
        description: draft.description.trim(),
        demo_url: demo,
        repo_url: repo,
        cover_path: draft.cover_path,
        tags: draft.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 8),
        is_visible: draft.is_visible,
      });
      onOpenChange(false);
    } catch {
      toast.error("Couldn't save that project. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{project ? "Edit project" : "Add project"}</DialogTitle>
          <DialogDescription>
            Show what you built. Visitors see this in your Developer&apos;s Arena.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-title">Title</Label>
            <Input
              id="project-title"
              value={draft.title}
              maxLength={120}
              placeholder="Realtime chat app"
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={draft.description}
              maxLength={600}
              rows={3}
              placeholder="What it does, what you built it with, why it matters."
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-demo">Live demo link</Label>
              <Input
                id="project-demo"
                value={draft.demo_url}
                placeholder="https://myapp.com"
                onChange={(e) => setDraft({ ...draft, demo_url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-repo">Code link</Label>
              <Input
                id="project-repo"
                value={draft.repo_url}
                placeholder="https://github.com/you/repo"
                onChange={(e) => setDraft({ ...draft, repo_url: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-tags">Tech used</Label>
            <Input
              id="project-tags"
              value={draft.tags}
              placeholder="React, Supabase, TypeScript"
              onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Separate with commas. Up to 8.</p>
          </div>

          <div className="space-y-2">
            <Label>Cover image</Label>
            <div className="flex items-center gap-3">
              <div className="grid h-16 w-28 shrink-0 place-items-center overflow-hidden rounded-lg glass">
                {coverPreview ? (
                  <img src={coverPreview} alt="Project cover" className="size-full object-cover" />
                ) : (
                  <Upload className="size-4 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  id="project-cover"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFile(file);
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={uploading}
                  onClick={() => inputRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Upload className="size-4" aria-hidden="true" />
                  )}
                  {draft.cover_path ? "Replace" : "Upload"}
                </Button>
                {draft.cover_path ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setDraft({ ...draft, cover_path: null })}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2">
            <Switch
              id="project-visible"
              checked={draft.is_visible}
              onCheckedChange={(v) => setDraft({ ...draft, is_visible: v })}
            />
            <Label htmlFor="project-visible" className="text-sm">
              {draft.is_visible ? "Visible on your page" : "Hidden"}
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              {project ? "Save changes" : "Add project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
