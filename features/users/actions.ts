"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/getCurrentUser";

export async function updateUserRole(id: string, role: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const supabase = await createSupabaseServer();

  const { error } = await supabase.from("users").update({ role }).eq("id", id);

  if (error) throw error;
}

export async function debugPeople(orgId: string) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.rpc("get_organization_people", {
    org_id: orgId,
  });

  console.log("PEOPLE:", data);
  console.log("ERROR:", error);

  return data;
}
