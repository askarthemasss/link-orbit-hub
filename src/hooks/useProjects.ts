import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export type ProjectInput = {
  title: string;
  description: string;
  demo_url: string | null;
  repo_url: string | null;
  cover_path: string | null;
  tags: string[];
  is_visible: boolean;
};

export function useProjects(profileId: string | undefined) {
  return useQuery({
    queryKey: ["projects", profileId],
    enabled: Boolean(profileId),
    queryFn: async (): Promise<ProjectRow[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("profile_id", profileId!)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useProjectMutations(profileId: string | undefined) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["projects", profileId] });

  const create = useMutation({
    mutationFn: async (input: ProjectInput & { display_order: number }) => {
      const { error } = await supabase.from("projects").insert({ ...input, profile_id: profileId! });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async (patch: Partial<ProjectRow> & { id: string }) => {
      const { id, ...rest } = patch;
      const { error } = await supabase.from("projects").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const reorder = useMutation({
    mutationFn: async (ordered: ProjectRow[]) => {
      await Promise.all(
        ordered.map((p, index) =>
          supabase.from("projects").update({ display_order: index }).eq("id", p.id),
        ),
      );
    },
    onMutate: async (ordered) => {
      await qc.cancelQueries({ queryKey: ["projects", profileId] });
      const previous = qc.getQueryData<ProjectRow[]>(["projects", profileId]);
      qc.setQueryData<ProjectRow[]>(
        ["projects", profileId],
        ordered.map((p, i) => ({ ...p, display_order: i })),
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(["projects", profileId], ctx.previous);
    },
    onSettled: invalidate,
  });

  return { create, update, remove, reorder };
}
