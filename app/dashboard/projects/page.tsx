import { createSupabaseServer } from "@/lib/supabase/server";
import ProjectsClient from "./projects-client";
import { getCurrentUser } from "@/features/auth/getCurrentUser";

export default async function ProjectsPage() {
  const supabase = await createSupabaseServer();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("organization_id", user.organizationId);

  if (error) throw error;

  return <ProjectsClient projects={projects || []} role={user.role} />;
}
