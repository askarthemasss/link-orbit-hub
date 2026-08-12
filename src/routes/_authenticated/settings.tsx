import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UsernameInput, type UsernameStatus } from "@/components/dashboard/UsernameInput";
import { useProfile, useSession, useUpdateProfile } from "@/hooks/useLinkOrbit";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — LinkOrbit" },
      { name: "description", content: "Manage your LinkOrbit username and account." },
      { property: "og:title", content: "Settings — LinkOrbit" },
      { property: "og:description", content: "Manage your LinkOrbit username and account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const profileQuery = useProfile();
  const session = useSession();
  const updateProfile = useUpdateProfile();
  const [username, setUsername] = useState<string | null>(null);
  const [status, setStatus] = useState<UsernameStatus>("idle");

  const profile = profileQuery.data;
  const value = username ?? profile?.username ?? "";
  const changed = Boolean(profile) && value !== profile?.username;

  async function saveUsername() {
    if (!profile) return;
    try {
      await updateProfile.mutateAsync({ id: profile.id, username: value });
      setUsername(null);
      toast.success("Username updated");
    } catch {
      toast.error("That username isn't available.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="font-display text-2xl font-semibold">Settings</h1>

        <section className="rounded-2xl glass p-5 sm:p-6" aria-labelledby="account-heading">
          <h2 id="account-heading" className="text-base font-semibold">
            Account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="text-foreground">{session.data?.email ?? "—"}</span>
          </p>
        </section>

        <section className="rounded-2xl glass p-5 sm:p-6" aria-labelledby="username-heading">
          <h2 id="username-heading" className="text-base font-semibold">
            Your link
          </h2>
          <p className="mt-2 mb-5 text-sm text-muted-foreground">
            Changing your username changes your public address immediately.
          </p>
          {profileQuery.isLoading ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
          ) : profile ? (
            <div className="space-y-4">
              <UsernameInput value={value} onChange={setUsername} onStatusChange={setStatus} />
              <Button
                onClick={() => void saveUsername()}
                disabled={!changed || status !== "available" || updateProfile.isPending}
              >
                {updateProfile.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                Save username
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Create your profile first from the editor.</p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
