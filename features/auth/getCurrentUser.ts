import { createSupabaseServer } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: membership, error } = await supabase
    .from("organization_members")
    .select("role, organization_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  if (!membership) {
    throw new Error("User has no organization membership");
  }

  return {
    id: user.id,
    email: user.email,
    role: membership.role,
    organizationId: membership.organization_id,
  };
}
