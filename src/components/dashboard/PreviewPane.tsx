import { PublicProfileView, type LinkViewData, type ProfileViewData } from "@/components/PublicProfileView";

export function PreviewPane({ profile, links }: { profile: ProfileViewData; links: LinkViewData[] }) {
  return (
    <div className="mx-auto w-full max-w-[21rem]">
      <div className="rounded-[2.2rem] border border-border bg-card/40 p-2 shadow-2xl backdrop-blur">
        <div className="max-h-[70vh] overflow-y-auto rounded-[1.7rem] bg-background/80">
          <PublicProfileView profile={profile} links={links} compact />
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Live preview</p>
    </div>
  );
}
