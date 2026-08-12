import { Check, Loader2 } from "lucide-react";

export function SaveState({ state }: { state: "idle" | "saving" | "saved" }) {
  if (state === "idle") return <span className="text-xs text-transparent select-none">.</span>;
  return (
    <span aria-live="polite" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      {state === "saving" ? (
        <>
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> Saving…
        </>
      ) : (
        <>
          <Check className="size-3.5 text-success" aria-hidden="true" /> Saved
        </>
      )}
    </span>
  );
}
