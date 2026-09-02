import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { avatarSrc } from "@/lib/avatar";
import { platformIcon } from "@/lib/platforms";
import { prettyUrl } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { EmptyOrbitIcon } from "@/components/EmptyOrbitIcon";
import { supabase } from "@/integrations/supabase/client";

const isSafeHttpUrl = (u: string) => /^https?:\/\//i.test(u.trim());

export type ProfileViewData = {
  id?: string;
  user_id?: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  location?: string | null;
  website_url?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type LinkViewData = {
  id: string;
  title: string;
  url: string;
  platform: string;
};

function initials(name: string, username: string) {
  const source = name.trim() || username;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="size-7 text-muted-foreground transition-colors hover:text-primary hover:opacity-100 group-hover:opacity-100"
      aria-label={copied ? "Copied" : "Copy link"}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Ignore unsupported environments
        }
      }}
    >
      {copied ? (
        <Check className="size-3.5 text-green-500" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
    </Button>
  );
}

export function PublicProfileView({
  profile,
  links,
  compact = false,
  avatarOverride,
}: {
  profile: ProfileViewData;
  links: LinkViewData[];
  compact?: boolean;
  avatarOverride?: string | null;
}) {
  const src = avatarOverride ?? avatarSrc(profile.avatar_url);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  const isOwner = Boolean(profile.user_id && currentUserId && profile.user_id === currentUserId);

  // Compact previews are embedded inside other pages, so they must not emit an <h1>.
  const NameHeading = compact ? "h2" : "h1";

  return (
    <div className={compact ? "px-5 py-8" : "px-5 py-14 sm:py-20"}>
      <div className="mx-auto w-full max-w-[30rem]">
        <header className="flex flex-col items-center text-center">
          <div
            className={`relative grid place-items-center overflow-hidden rounded-full glass-strong glow-ring ${
              compact ? "size-20" : "size-28"
            }`}
          >
            {src ? (
              <img
                src={src}
                alt={`${profile.display_name || profile.username} profile picture`}
                loading="lazy"
                className="size-full object-cover"
              />
            ) : (
              <span className={`font-display font-semibold ${compact ? "text-xl" : "text-3xl"}`}>
                {initials(profile.display_name, profile.username) || "★"}
              </span>
            )}
          </div>

          <NameHeading
            className={`mt-5 font-semibold ${compact ? "text-lg" : "text-2xl sm:text-3xl"}`}
          >
            {profile.display_name || `@${profile.username}`}
          </NameHeading>
          <p className="mt-1 text-sm text-muted-foreground">@{profile.username}</p>

          {profile.bio ? (
            <p className={`mt-4 text-balance leading-relaxed text-muted-foreground ${compact ? "text-xs" : "text-sm sm:text-base"}`}>
              {profile.bio}
            </p>
          ) : null}

          {profile.location ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden="true" />
              {profile.location}
            </p>
          ) : null}

          {profile.website_url && isSafeHttpUrl(profile.website_url) ? (
            <span className="group mt-3 inline-flex items-center gap-0.5">
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                {prettyUrl(profile.website_url)}
              </a>
              <CopyLinkButton url={profile.website_url} />
            </span>
          ) : null}

          {profile.email || profile.phone ? (
            <div className={`mt-4 flex flex-wrap items-center justify-center gap-2 ${compact ? "text-xs" : "text-sm"}`}>
              {profile.email ? (
                <span className="group inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-muted-foreground">
                  <Mail className="size-3.5 text-primary" aria-hidden="true" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-medium underline-offset-4 hover:text-primary hover:underline"
                  >
                    {profile.email}
                  </a>
                  <CopyLinkButton url={profile.email} />
                </span>
              ) : null}
              {profile.phone ? (
                <span className="group inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-muted-foreground">
                  <Phone className="size-3.5 text-primary" aria-hidden="true" />
                  <a
                    href={`tel:${profile.phone.replace(/[^0-9+]/g, "")}`}
                    className="font-medium underline-offset-4 hover:text-primary hover:underline"
                  >
                    {profile.phone}
                  </a>
                  <CopyLinkButton url={profile.phone} />
                </span>
              ) : null}
            </div>
          ) : null}
        </header>

        <nav aria-label="Links" className={compact ? "mt-6 space-y-2.5" : "mt-9 space-y-3"}>
        {links.length === 0 ? (
          <div className="rounded-2xl glass px-5 py-8 text-center">
            <EmptyOrbitIcon className="mx-auto size-12" />
            <p className="mt-4 text-sm font-medium">
              {isOwner ? "Your orbit is empty" : "No links here yet"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isOwner
                ? "Add your first link from the dashboard and it will appear here."
                : "Check back later to see what they share."}
            </p>
            {isOwner ? (
              <Button asChild size="sm" className="mt-4">
                <Link to="/dashboard">Add a link</Link>
              </Button>
            ) : null}
          </div>
        ) : (
            links
              .filter((link) => isSafeHttpUrl(link.url))
              .map((link) => {
              const Icon = platformIcon(link.platform);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={`group flex items-center gap-3 rounded-2xl glass transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:glow-ring active:translate-y-0 ${
                    compact ? "px-3.5 py-3" : "px-4 py-4"
                  }`}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary/70 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate font-medium ${compact ? "text-sm" : "text-[0.95rem]"}`}>
                      {link.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{prettyUrl(link.url)}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-0.5">
                    <CopyLinkButton url={link.url} />
                    <ArrowUpRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              );
            })
          )}
        </nav>

        {!compact ? (
          <footer className="mt-12 text-center">
            <a
              href="/"
              className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Create your LinkOrbit
            </a>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
