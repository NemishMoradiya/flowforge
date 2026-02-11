"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/getCurrentUser";

export async function acceptInvite(token: string) {
  const supabase = await createSupabaseServer();
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const { data: invite, error } = await supabase
    .from("organization_invites")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !invite) {
    throw new Error("Invalid or expired invite");
  }

  await supabase.from("organization_members").insert({
    organization_id: invite.organization_id,
    user_id: user.id,
    role: invite.role,
  });

  await supabase.from("organization_invites").delete().eq("id", invite.id);
}
