import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Signed URL for the owner's own avatar (works even while the profile is private). */
export function useOwnerAvatarUrl(path: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!path) {
      setUrl(null);
      return;
    }
    if (/^https?:\/\//i.test(path)) {
      setUrl(path);
      return;
    }
    supabase.storage
      .from("avatars")
      .createSignedUrl(path, 3600)
      .then(({ data }) => {
        if (active) setUrl(data?.signedUrl ?? null);
      });
    return () => {
      active = false;
    };
  }, [path]);

  return url;
}
