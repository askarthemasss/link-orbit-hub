import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { avatarSrc } from "@/lib/avatar";

const MAX_BYTES = 3 * 1024 * 1024;

/** Downscales an image client-side so we never store huge originals. */
async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const size = 512;
  const scale = Math.min(1, size / Math.max(bitmap.width, bitmap.height));
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

export function AvatarUploader({
  avatarUrl,
  onChange,
}: {
  avatarUrl: string | null;
  onChange: (path: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const src = avatarSrc(avatarUrl);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("That file isn't an image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Images must be under 3 MB.");
      return;
    }
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("Not signed in");
      const blob = await compress(file);
      const path = `${user.id}/avatar-${Date.now()}.jpg`;
      const { error } = await supabase.storage.from("avatars").upload(path, blob, {
        contentType: "image/jpeg",
        upsert: true,
      });
      if (error) throw error;
      if (avatarUrl && !/^https?:/i.test(avatarUrl)) {
        await supabase.storage.from("avatars").remove([avatarUrl]);
      }
      onChange(path);
      toast.success("Profile image updated");
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (avatarUrl && !/^https?:/i.test(avatarUrl)) {
      await supabase.storage.from("avatars").remove([avatarUrl]);
    }
    onChange(null);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full glass">
        {src ? (
          <img src={src} alt="Your profile" className="size-full object-cover" />
        ) : (
          <Upload className="size-5 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          id="avatar-file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Upload className="size-4" aria-hidden="true" />}
          {src ? "Replace image" : "Upload image"}
        </Button>
        {src ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => void handleRemove()}>
            <Trash2 className="size-4" aria-hidden="true" />
            Remove
          </Button>
        ) : null}
      </div>
    </div>
  );
}
