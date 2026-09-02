import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvatarUploader } from "./AvatarUploader";
import { SaveState } from "./SaveState";
import type { Profile } from "@/hooks/useLinkOrbit";

export type ProfileDraft = {
  display_name: string;
  bio: string;
  location: string;
  website_url: string;
  email: string;
  phone: string;
  avatar_url: string | null;
};

export function ProfileEditor({
  profile,
  draft,
  onDraftChange,
  onSave,
  saveState,
}: {
  profile: Profile;
  draft: ProfileDraft;
  onDraftChange: (draft: ProfileDraft) => void;
  onSave: (draft: ProfileDraft) => void;
  saveState: "idle" | "saving" | "saved";
}) {
  const [dirty, setDirty] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!dirty) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onSave(draft);
      setDirty(false);
    }, 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, dirty]);

  function set<K extends keyof ProfileDraft>(key: K, value: ProfileDraft[K], immediate = false) {
    const next = { ...draft, [key]: value };
    onDraftChange(next);
    if (immediate) {
      onSave(next);
      setDirty(false);
    } else {
      setDirty(true);
    }
  }

  return (
    <section className="rounded-2xl glass p-5 sm:p-6" aria-labelledby="profile-heading">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id="profile-heading" className="text-base font-semibold">
          Profile
        </h2>
        <SaveState state={saveState} />
      </div>

      <div className="space-y-5">
        <AvatarUploader avatarUrl={draft.avatar_url} onChange={(path) => set("avatar_url", path, true)} />

        <div className="space-y-2">
          <Label htmlFor="display_name">Display name</Label>
          <Input
            id="display_name"
            value={draft.display_name}
            maxLength={60}
            placeholder="Mohamed Askar"
            onChange={(e) => set("display_name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={draft.bio}
            maxLength={200}
            rows={3}
            placeholder="Developer. Building small useful things."
            onChange={(e) => set("bio", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">{draft.bio.length}/200</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              value={draft.location}
              maxLength={60}
              placeholder="Chennai, India"
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website_url">Website (optional)</Label>
            <Input
              id="website_url"
              value={draft.website_url}
              placeholder="https://example.com"
              inputMode="url"
              onChange={(e) => set("website_url", e.target.value)}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Your public address: <span className="text-foreground">/{profile.username}</span> — change it in Settings.
        </p>
      </div>
    </section>
  );
}
