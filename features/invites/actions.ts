"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import crypto from "crypto";

export async function inviteUser(email: string, role: string) {
  const supabase = await createSupabaseServer();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");
  if (user.role !== "admin") throw new Error("Forbidden");

  const token = crypto.randomUUID();

  const { error } = await supabase.from("organization_invites").insert({
    organization_id: user.organizationId,
    email,
    role,
    token,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  if (error) {
    console.error("INVITE INSERT ERROR:", error);
    throw error;
  }

  return token;
}
