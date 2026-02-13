"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function acceptInvite() {
  const supabase = await createSupabaseServer();

  const cookieStore = await cookies();

  const token = cookieStore.get("invite_token")?.value;
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
    cookieStore.delete("invite_token");
    throw new Error("Invalid invite");
  }

  if (new Date(invite.expires_at) < new Date()) {
    cookieStore.delete("invite_token");
    throw new Error("Invite expired");
  }

  if (invite.email !== user.email) {
    await supabase.auth.signOut();
    cookieStore.delete("invite_token");
    throw new Error("Email mismatch");
  }

  await supabase.from("organization_members").insert({
    organization_id: invite.organization_id,
    user_id: user.id,
    role: invite.role,
  });

  await supabase.from("organization_invites").delete().eq("id", invite.id);

  cookieStore.delete("invite_token");
}
