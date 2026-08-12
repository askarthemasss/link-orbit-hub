import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkUsernameAvailable } from "@/hooks/useLinkOrbit";
import { normalizeUsername, usernameError } from "@/lib/validation";

export type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export function UsernameInput({
  value,
  onChange,
  onStatusChange,
  label = "Username",
}: {
  value: string;
  onChange: (value: string) => void;
  onStatusChange?: (status: UsernameStatus) => void;
  label?: string;
}) {
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const error = usernameError(value);
    if (error) {
      setStatus("invalid");
      setMessage(error);
      onStatusChange?.("invalid");
      return;
    }
    setStatus("checking");
    setMessage(null);
    onStatusChange?.("checking");
    const timer = setTimeout(async () => {
      try {
        const available = await checkUsernameAvailable(value);
        const next: UsernameStatus = available ? "available" : "taken";
        setStatus(next);
        setMessage(available ? "Username available" : "Username already taken");
        onStatusChange?.(next);
      } catch {
        setStatus("invalid");
        setMessage("Couldn't check that username. Try again.");
        onStatusChange?.("invalid");
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor="username">{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          linkorbit.app/
        </span>
        <Input
          id="username"
          value={value}
          onChange={(e) => onChange(normalizeUsername(e.target.value))}
          className="pl-[6.6rem] pr-9"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-describedby="username-status"
          placeholder="askar"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {status === "checking" ? <Loader2 className="size-4 animate-spin text-muted-foreground" aria-hidden="true" /> : null}
          {status === "available" ? <Check className="size-4 text-success" aria-hidden="true" /> : null}
          {status === "taken" || status === "invalid" ? <X className="size-4 text-destructive" aria-hidden="true" /> : null}
        </span>
      </div>
      <p
        id="username-status"
        aria-live="polite"
        className={`text-xs ${status === "available" ? "text-success" : status === "checking" ? "text-muted-foreground" : "text-destructive"}`}
      >
        {message ?? (status === "checking" ? "Checking availability…" : "")}
      </p>
    </div>
  );
}
