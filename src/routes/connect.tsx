import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Copy, Bot, Terminal, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

type Client = "chatgpt" | "claude" | "claude-code" | "other";

const CLIENTS: { id: Client; label: string; icon: React.ElementType }[] = [
  { id: "chatgpt", label: "ChatGPT", icon: Bot },
  { id: "claude", label: "Claude", icon: Bot },
  { id: "claude-code", label: "Claude Code", icon: Terminal },
  { id: "other", label: "Other", icon: Globe },
];

function normalizeAppSlug(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 63);
  if (!slug) return "lovable-app";
  const reserved = new Set(["workspace", "computer-use", "claude-in-chrome", "claude-preview", "claude-browser"]);
  return reserved.has(slug) ? `${slug}-app` : slug;
}

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  component: DisabledRedirect,
});

// AI assistant connections are temporarily disabled — send visitors home.
function DisabledRedirect() {
  return <Navigate to="/" replace />;
}

function ConnectPage() {
  const [mcpUrl, setMcpUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeClient, setActiveClient] = useState<Client>("chatgpt");

  useEffect(() => {
    setMcpUrl(new URL("/mcp", window.location.origin).toString());
  }, []);

  const appSlug = useMemo(() => normalizeAppSlug("LTReee"), []);

  async function copyUrl() {
    if (!mcpUrl) return;
    try {
      await navigator.clipboard.writeText(mcpUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the input text
      const input = document.getElementById("mcp-url") as HTMLInputElement | null;
      input?.select();
    }
  }

  const claudePrefilledUrl = useMemo(() => {
    const url = new URL("https://claude.ai/customize/connectors");
    url.searchParams.set("modal", "add-custom-connector");
    url.searchParams.set("connectorName", "LTReee");
    url.searchParams.set("connectorUrl", mcpUrl || "");
    return url.toString();
  }, [mcpUrl]);

  const claudeCodeCommand = useMemo(() => {
    const url = mcpUrl.replace(/'/g, "'\\''");
    return `claude mcp add --scope user --transport http ${appSlug} '${url}'`;
  }, [mcpUrl, appSlug]);

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid size-8 place-items-center rounded-full border border-primary/40 text-primary">
            <span className="size-2 rounded-full bg-primary" />
          </span>
          LTReee
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Dashboard
            </Link>
          </Button>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Connect an AI assistant</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Use ChatGPT, Claude, or Claude Code to read and update your LTReee profile and links through
            a secure connection.
          </p>
        </div>

        <section className="mt-10 rounded-2xl glass-strong p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">MCP server URL</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Copy this address and paste it into your AI assistant's custom MCP connector settings.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <input
                id="mcp-url"
                readOnly
                value={mcpUrl || "Loading…"}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                onClick={(e) => (e.currentTarget as HTMLInputElement).select()}
              />
              {mcpUrl ? (
                <button
                  onClick={() => void copyUrl()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Copy URL"
                >
                  {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
                </button>
              ) : null}
            </div>
            <Button onClick={() => void copyUrl()} disabled={!mcpUrl || copied} className="shrink-0">
              {copied ? (
                <>
                  <Check className="size-4" aria-hidden="true" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" aria-hidden="true" /> Copy URL
                </>
              )}
            </Button>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="connect-heading">
          <h2 id="connect-heading" className="font-display text-xl font-semibold sm:text-2xl">
            How to connect
          </h2>

          <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Choose an AI client">
            {CLIENTS.map((client) => {
              const Icon = client.icon;
              const active = activeClient === client.id;
              return (
                <button
                  key={client.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveClient(client.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {client.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl glass p-6 sm:p-8">
            {activeClient === "chatgpt" && (
              <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-foreground">
                <li>
                  Open{" "}
                  <a
                    href="https://chatgpt.com/#settings/Connectors/Advanced"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    ChatGPT's Connectors settings
                  </a>{" "}
                  and enable Developer mode if you haven't already.
                </li>
                <li>
                  Open{" "}
                  <a
                    href="https://chatgpt.com/plugins#settings/Connectors?create-connector=true&redirectAfter=%2Fplugins"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    the new-connector dialog
                  </a>
                  .
                </li>
                <li>
                  Name the connector <strong>LTReee</strong> and paste the MCP URL above into the URL field.
                </li>
                <li>
                  Review the details, check "I understand and want to continue", then click{" "}
                  <strong>Create</strong>.
                </li>
                <li>Enable the app from the chat composer, then ask ChatGPT to use LTReee.</li>
              </ol>
            )}

            {activeClient === "claude" && (
              <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-foreground">
                <li>
                  Open{" "}
                  <a
                    href={claudePrefilledUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    Claude's custom connector dialog
                  </a>{" "}
                  with LTReee and the MCP URL prefilled.
                </li>
                <li>
                  Review the details and click <strong>Add</strong>.
                </li>
                <li>
                  If the prefilled form doesn't open, go to Claude's Connectors page, choose{" "}
                  <strong>Add custom connector</strong>, name it <strong>LTReee</strong>, and paste the
                  MCP URL above.
                </li>
                <li>Enable the connector from the chat composer, then ask Claude to use LTReee.</li>
              </ol>
            )}

            {activeClient === "claude-code" && (
              <div className="space-y-4 text-sm leading-relaxed text-foreground">
                <p>Run this one-line command in your terminal. It connects Claude Code to LTReee from any directory.</p>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg border border-input bg-background p-4 font-mono text-xs sm:text-sm">
                    <code>{claudeCodeCommand}</code>
                  </pre>
                  <button
                    onClick={() => void navigator.clipboard.writeText(claudeCodeCommand)}
                    className="absolute right-2 top-2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Copy command"
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
                <ol className="list-decimal space-y-3 pl-5">
                  <li>Paste the command into a terminal and press Enter.</li>
                  <li>Start Claude Code and run <code>/mcp</code> to confirm LTReee is connected.</li>
                  <li>If the app asks you to sign in, approve it with your LTReee account.</li>
                  <li>Ask Claude Code to use LTReee.</li>
                </ol>
              </div>
            )}

            {activeClient === "other" && (
              <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-foreground">
                <li>Open your AI client's MCP server or custom connector settings.</li>
                <li>Create a new remote MCP server connection.</li>
                <li>Name it <strong>LTReee</strong> and paste the MCP URL above.</li>
                <li>Complete any sign-in or authorization prompts.</li>
                <li>Enable the connection, then ask the assistant to use LTReee.</li>
              </ol>
            )}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="refresh-heading">
          <h2 id="refresh-heading" className="font-display text-xl font-semibold sm:text-2xl">
            Refresh after the app changes
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Connected assistants cache the tool list. After LTReee ships an update, refresh the connection so the assistant sees the latest tools.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl glass p-5">
              <h3 className="font-display text-base font-semibold">ChatGPT</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Open the Plugins page, select LTReee, and click <strong>Refresh</strong> under Information.
                If the URL changed, delete the connector and reconnect with the latest URL above.
              </p>
            </div>
            <div className="rounded-2xl glass p-5">
              <h3 className="font-display text-base font-semibold">Claude</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Open the Connectors page, select LTReee, and refresh or update its tools. If the URL changed,
                remove the connector and reconnect with the latest URL above.
              </p>
            </div>
            <div className="rounded-2xl glass p-5">
              <h3 className="font-display text-base font-semibold">Claude Code</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start a new Claude Code session to load the latest tools. If the URL changed, run{" "}
                <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">claude mcp remove {appSlug}</code>,
                then run the install command again with the latest URL.
              </p>
            </div>
            <div className="rounded-2xl glass p-5">
              <h3 className="font-display text-base font-semibold">Other clients</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Open the MCP server or connector settings, select LTReee, and refresh, reload, or reconnect. If the URL changed,
                paste the latest URL above and start a new chat.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-8 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} LTReee</p>
        <Link to="/" className="hover:text-foreground">
          Back to home
        </Link>
      </footer>
    </div>
  );
}
