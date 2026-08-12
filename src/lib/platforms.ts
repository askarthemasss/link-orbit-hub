import {
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Send,
  Mail,
  Globe,
  Music2,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

export type PlatformId =
  | "website"
  | "linkedin"
  | "github"
  | "instagram"
  | "youtube"
  | "x"
  | "facebook"
  | "tiktok"
  | "discord"
  | "telegram"
  | "email"
  | "other";

export const PLATFORMS: { id: PlatformId; label: string; icon: LucideIcon; hosts: string[] }[] = [
  { id: "website", label: "Website", icon: Globe, hosts: [] },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, hosts: ["linkedin.com"] },
  { id: "github", label: "GitHub", icon: Github, hosts: ["github.com"] },
  { id: "instagram", label: "Instagram", icon: Instagram, hosts: ["instagram.com"] },
  { id: "youtube", label: "YouTube", icon: Youtube, hosts: ["youtube.com", "youtu.be"] },
  { id: "x", label: "X", icon: Twitter, hosts: ["x.com", "twitter.com"] },
  { id: "facebook", label: "Facebook", icon: Facebook, hosts: ["facebook.com", "fb.com"] },
  { id: "tiktok", label: "TikTok", icon: Music2, hosts: ["tiktok.com"] },
  { id: "discord", label: "Discord", icon: MessageCircle, hosts: ["discord.gg", "discord.com"] },
  { id: "telegram", label: "Telegram", icon: Send, hosts: ["t.me", "telegram.me"] },
  { id: "email", label: "Email", icon: Mail, hosts: ["mailto"] },
  { id: "other", label: "Other", icon: Globe, hosts: [] },
];

export function platformIcon(platform: string): LucideIcon {
  return PLATFORMS.find((p) => p.id === platform)?.icon ?? Globe;
}

export function platformLabel(platform: string): string {
  return PLATFORMS.find((p) => p.id === platform)?.label ?? "Website";
}

/** Guess a platform from a URL without calling any external service. */
export function detectPlatform(rawUrl: string): PlatformId {
  let host = "";
  try {
    host = new URL(rawUrl.includes("://") ? rawUrl : `https://${rawUrl}`).hostname.toLowerCase();
  } catch {
    return "website";
  }
  const clean = host.replace(/^www\./, "");
  const match = PLATFORMS.find((p) => p.hosts.some((h) => clean === h || clean.endsWith(`.${h}`)));
  return match?.id ?? "website";
}
