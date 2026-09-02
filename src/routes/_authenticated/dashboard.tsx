import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { normalizeUrl } from "@/lib/validation";
import { profileUrl, profileUrlDisplay } from "@/lib/site-url";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PreviewPane } from "@/components/dashboard/PreviewPane";
import { ProfileEditor, type ProfileDraft } from "@/components/dashboard/ProfileEditor";
import { LinkManager } from "@/components/dashboard/LinkManager";
import { UsernameInput, type UsernameStatus } from "@/components/dashboard/UsernameInput";
import {
  useCreateProfile,
  useLinkMutations,
  useLinks,
  useProfile,
  useUpdateProfile,
  type LinkRow,
} from "@/hooks/useLinkOrbit";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your editor — LinkOrbit" },
      { name: "description", content: "Edit your LinkOrbit profile, links and publish state." },
      { property: "og:title", content: "Your editor — LinkOrbit" },
      { property: "og:description", content: "Edit your LinkOrbit profile, links and publish state." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const profileQuery = useProfile();

  if (profileQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="grid place-items-center py-24 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {profileQuery.data ? <Editor profile={profileQuery.data} /> : <Onboarding />}
    </DashboardLayout>
  );
}

function Onboarding() {
  const createProfile = useCreateProfile();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState<UsernameStatus>("idle");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status !== "available") return;
    try {
      await createProfile.mutateAsync({ username, display_name: displayName.trim() || username });
      toast.success("Your orbit is ready");
    } catch {
      toast.error("We couldn't create that profile. Try a different username.");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl font-semibold">Claim your link</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This is the address you'll share. You can change it later.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-2xl glass p-5 sm:p-6">
        <UsernameInput value={username} onChange={setUsername} onStatusChange={setStatus} />
        <div className="space-y-2">
          <Label htmlFor="onboard-name">Display name</Label>
          <Input
            id="onboard-name"
            value={displayName}
            maxLength={60}
            placeholder="Your name"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={status !== "available" || createProfile.isPending}>
          {createProfile.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Create my LinkOrbit
        </Button>
      </form>
    </div>
  );
}

function Editor({ profile }: { profile: NonNullable<ReturnType<typeof useProfile>["data"]> }) {
  const linksQuery = useLinks(profile.id);
  const updateProfile = useUpdateProfile();
  const links = useLinkMutations(profile.id);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [copied, setCopied] = useState(false);

  const [draft, setDraft] = useState<ProfileDraft>({
    display_name: profile.display_name ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    website_url: profile.website_url ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    avatar_url: profile.avatar_url,
  });

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const publicUrl = profileUrl(profile.username);

  async function save(next: ProfileDraft) {
    setSaveState("saving");
    const website = next.website_url.trim() ? normalizeUrl(next.website_url) : null;
    if (next.website_url.trim() && !website) {
      setSaveState("idle");
      toast.error("Enter a valid website address starting with http:// or https://");
      return;
    }
    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        display_name: next.display_name,
        bio: next.bio,
        location: next.location || null,
        website_url: website,
        avatar_url: next.avatar_url,
      });
      setSaveState("saved");
    } catch {
      setSaveState("idle");
      toast.error("Changes couldn't be saved. Check your connection.");
    }
  }

  async function togglePublished(value: boolean) {
    try {
      await updateProfile.mutateAsync({ id: profile.id, is_published: value });
      toast.success(value ? "Your page is live" : "Your page is now private");
    } catch {
      toast.error("Couldn't update publish state.");
    }
  }

  const activeLinks = (linksQuery.data ?? []).filter((l) => l.is_active);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6">
        <section className="flex flex-col gap-4 rounded-2xl glass p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <h1 className="font-display text-lg font-semibold">Your page</h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">{profileUrlDisplay(profile.username)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await navigator.clipboard.writeText(publicUrl);
                setCopied(true);
              }}
            >
              {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
              {copied ? "Copied" : "Copy link"}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" aria-hidden="true" />
                Visit
              </a>
            </Button>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-1.5">
              <Switch
                id="published"
                checked={profile.is_published}
                onCheckedChange={(v) => void togglePublished(v)}
              />
              <Label htmlFor="published" className="text-sm">
                {profile.is_published ? "Published" : "Private"}
              </Label>
            </div>
          </div>
        </section>

        <ProfileEditor
          profile={profile}
          draft={draft}
          onDraftChange={setDraft}
          onSave={(next) => void save(next)}
          saveState={saveState}
        />

        <LinkManager
          links={linksQuery.data ?? []}
          loading={linksQuery.isLoading}
          onCreate={async (value) => {
            await links.create.mutateAsync({
              ...value,
              display_order: (linksQuery.data ?? []).length,
            });
          }}
          onUpdate={async (id, value) => {
            await links.update.mutateAsync({ id, ...value });
          }}
          onDelete={async (id) => {
            await links.remove.mutateAsync(id);
          }}
          onReorder={(ordered: LinkRow[]) => links.reorder.mutate(ordered)}
        />
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <PreviewPane
          profile={{
            username: profile.username,
            display_name: draft.display_name,
            bio: draft.bio,
            avatar_url: draft.avatar_url,
            location: draft.location,
            website_url: draft.website_url,
          }}
          links={activeLinks}
        />
      </aside>
    </div>
  );
}
