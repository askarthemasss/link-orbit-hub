import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type LinkRow = Database["public"]["Tables"]["links"]["Row"];

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
    staleTime: 60_000,
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile | null> => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useLinks(profileId: string | undefined) {
  return useQuery({
    queryKey: ["links", profileId],
    enabled: Boolean(profileId),
    queryFn: async (): Promise<LinkRow[]> => {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("profile_id", profileId!)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { username: string; display_name: string }) => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) throw new Error("You need to be signed in.");
      const { data, error } = await supabase
        .from("profiles")
        .insert({ user_id: user.id, username: input.username, display_name: input.display_name })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Profile> & { id: string }) => {
      const { id, ...rest } = patch;
      const { data, error } = await supabase.from("profiles").update(rest).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(["profile"], data);
    },
  });
}

export function useLinkMutations(profileId: string | undefined) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["links", profileId] });

  const create = useMutation({
    mutationFn: async (input: { title: string; url: string; platform: string; display_order: number }) => {
      const { error } = await supabase.from("links").insert({ ...input, profile_id: profileId! });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async (patch: Partial<LinkRow> & { id: string }) => {
      const { id, ...rest } = patch;
      const { error } = await supabase.from("links").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const reorder = useMutation({
    mutationFn: async (ordered: LinkRow[]) => {
      await Promise.all(
        ordered.map((link, index) =>
          supabase.from("links").update({ display_order: index }).eq("id", link.id),
        ),
      );
    },
    onMutate: async (ordered) => {
      await qc.cancelQueries({ queryKey: ["links", profileId] });
      const previous = qc.getQueryData<LinkRow[]>(["links", profileId]);
      qc.setQueryData<LinkRow[]>(["links", profileId], ordered.map((l, i) => ({ ...l, display_order: i })));
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(["links", profileId], ctx.previous);
    },
    onSettled: invalidate,
  });

  return { create, update, remove, reorder };
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const { checkUsernameAvailability } = await import("@/lib/username.functions");
  const result = await checkUsernameAvailability({ data: { username } });
  return Boolean(result.available);
}
