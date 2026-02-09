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
