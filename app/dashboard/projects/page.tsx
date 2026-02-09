import { createSupabaseServer } from "@/lib/supabase/server";
import ProjectsClient from "./projects-client";

export default async function ProjectsPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user?.id);

  if (error) throw error;

  return <ProjectsClient projects={projects || []} />;
}
