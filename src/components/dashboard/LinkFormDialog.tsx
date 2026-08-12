import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLATFORMS, detectPlatform, type PlatformId } from "@/lib/platforms";
import { normalizeUrl } from "@/lib/validation";

export type LinkFormValue = { title: string; url: string; platform: string };

export function LinkFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  pending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: LinkFormValue;
  onSubmit: (value: LinkFormValue) => void;
  pending?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<PlatformId>("website");
  const [touchedPlatform, setTouchedPlatform] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setUrl(initial?.url ?? "");
    setPlatform((initial?.platform as PlatformId) ?? "website");
    setTouchedPlatform(Boolean(initial));
    setError(null);
  }, [open, initial]);

  function handleUrlChange(value: string) {
    setUrl(value);
    setError(null);
    if (!touchedPlatform) setPlatform(detectPlatform(value));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Give your link a title.");
      return;
    }
    const safeUrl = normalizeUrl(url);
    if (!safeUrl) {
      setError("Enter a valid web address, like https://github.com/you");
      return;
    }
    onSubmit({ title: trimmedTitle, url: safeUrl, platform });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit link" : "Add link"}</DialogTitle>
          <DialogDescription>Links appear on your public profile in the order you set.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-title">Title</Label>
            <Input
              id="link-title"
              value={title}
              maxLength={60}
              placeholder="GitHub"
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={url}
              inputMode="url"
              placeholder="https://github.com/you"
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-platform">Platform</Label>
            <Select
              value={platform}
              onValueChange={(value) => {
                setPlatform(value as PlatformId);
                setTouchedPlatform(true);
              }}
            >
              <SelectTrigger id="link-platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {initial ? "Save link" : "Add link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
