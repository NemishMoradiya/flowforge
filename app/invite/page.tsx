import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import AcceptInviteButton from "./accept-button";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const { token } = await searchParams;

  if (!token) redirect("/dashboard");

  const inviteToken = token;

  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?token=${token}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border bg-card p-8 shadow-lg space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              You’ve been invited 🎉
            </h1>
            <p className="text-sm text-muted-foreground">
              Join this organization to collaborate on projects.
            </p>
          </div>

          <AcceptInviteButton token={inviteToken} />

          <p className="text-xs text-muted-foreground">
            By accepting, you’ll gain access based on your assigned role.
          </p>
        </div>
      </div>
    </div>
  );
}
