import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    // A stored session is authoritative for rendering the shell. getUser() can
    // fail transiently (offline, slow token refresh, brokered preview storage)
    // and must not bounce an already signed-in user to /auth.
    const { data: sessionResult } = await supabase.auth.getSession();
    if (sessionResult.session?.user) {
      return { user: sessionResult.session.user };
    }

    const { data, error } = await supabase.auth.getUser();
    if (!error && data.user) {
      return { user: data.user };
    }

    // Retry once: the session may still be hydrating right after a redirect.
    await new Promise((resolve) => setTimeout(resolve, 250));
    const { data: retry } = await supabase.auth.getSession();
    if (retry.session?.user) {
      return { user: retry.session.user };
    }

    throw redirect({
      to: "/auth",
      search: { next: location.pathname + location.searchStr },
    });
  },
  component: () => <Outlet />,
});
