"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function acceptInvite(token: string) {
  const supabase = await createSupabaseServer();

  if (!token) throw new Error("Missing invite token");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: invite, error } = await supabase
    .from("organization_invites")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !invite) {
    throw new Error("Invalid invite");
  }

  if (new Date(invite.expires_at) < new Date()) {
    throw new Error("Invite expired");
  }

  if (invite.email !== user.email) {
    await supabase.auth.signOut();
    throw new Error("Email mismatch");
  }

  await supabase.from("organization_members").insert({
    organization_id: invite.organization_id,
    user_id: user.id,
    role: invite.role,
  });

  await supabase.from("organization_invites").delete().eq("id", invite.id);
}
