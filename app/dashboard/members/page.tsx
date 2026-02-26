import { getCurrentUser } from "@/features/auth/getCurrentUser";
import { redirect } from "next/navigation";
import MembersClient from "./members-client";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function MembersPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const supabase = await createSupabaseServer();

  const { data: people, error } = await supabase.rpc(
    "get_organization_people",
    { org_id: user.organizationId },
  );

  if (error) {
    throw new Error(error.message);
  }

  return <MembersClient people={people ?? []} currentUserRole={user.role} />;
}
