import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import { createSupabaseServer } from "@/lib/supabase/server";
import UsersClient from "./users-client";

export default async function UsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/login");
  if (currentUser.role !== "admin") redirect("/dashboard");

  const supabase = await createSupabaseServer();

  const { data: users } = await supabase.from("users").select("*");

  return <UsersClient users={users || []} />;
}
