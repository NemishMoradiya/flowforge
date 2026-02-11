"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { getCurrentUser } from "../auth/getCurrentUser";

export async function createProject(name: string) {
  const supabase = await createSupabaseServer();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  // 🔒 ROLE ENFORCEMENT
  if (user.role !== "admin") {
    throw new Error("Only admins can create projects");
  }

  const { error } = await supabase.from("projects").insert({
    name,
    organization_id: user.organizationId,
  });

  if (error) throw error;
}

export async function updateProject(id: string, name: string) {
  const supabase = await createSupabaseServer();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  if (user.role !== "admin") {
    throw new Error("Only admins can update projects");
  }

  const { error } = await supabase
    .from("projects")
    .update({ name })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteProject(id: string) {
  const supabase = await createSupabaseServer();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  if (user.role !== "admin") {
    throw new Error("Only admins can delete projects");
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw error;
}
