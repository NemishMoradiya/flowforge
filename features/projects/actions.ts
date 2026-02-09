"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function createProject(name: string) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase.from("projects").insert({
    name,
    description: "",
    user_id: (await supabase.auth.getUser()).data.user?.id,
  });

  if (error) throw error;
}

export async function updateProject(id: string, name: string) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("projects")
    .update({ name })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteProject(id: string) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw error;
}
