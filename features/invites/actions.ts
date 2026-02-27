"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import crypto from "crypto";

export async function inviteUser(email: string, role: string) {
  console.log("INVITE ACTION CALLED", { email, role });
  const supabase = await createSupabaseServer();
  const user = await getCurrentUser();
  console.log("CURRENT USER IN INVITE:", user);

  if (!user) throw new Error("Unauthorized");
  if (user.role !== "admin") throw new Error("Forbidden");

  const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

  const token = crypto.randomUUID();

  const { error } = await supabase.from("organization_invites").insert({
    organization_id: user.organizationId,
    email,
    role,
    token,
    expires_at,
    invited_by: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("User already invited");
    }

    throw error;
  }

  if (error) {
    console.error("INVITE INSERT ERROR:", error);
    throw error;
  }

  return token;
}

export async function acceptInviteAfterSignup(token: string) {
  const supabase = await createSupabaseServer();

  // 1. Get invite
  const { data: invite, error } = await supabase
    .from("organization_invites")
    .select("*")
    .eq("token", token)
    .is("accepted_at", null)
    .single();

  if (error || !invite) {
    throw new Error("Invalid or expired invite");
  }

  // 2. Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  // 3. Insert into organization_members
  const { error: insertError } = await supabase
    .from("organization_members")
    .insert({
      organization_id: invite.organization_id,
      user_id: user.id,
      role: invite.role,
    });

  if (insertError) throw insertError;

  // 4. Mark invite accepted
  const { error: updateError } = await supabase
    .from("organization_invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  if (updateError) throw updateError;

  return true;
}
