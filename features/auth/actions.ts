"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function provisionUserOrg() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user");

  // Create organization
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: `${user.email}'s Organization`,
    })
    .select()
    .single();

  if (orgError) throw orgError;

  // Add user as admin member
  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({
      organization_id: org.id,
      user_id: user.id,
      role: "admin",
    });

  if (memberError) throw memberError;
}
