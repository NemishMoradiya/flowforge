import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import AcceptInviteButton from "./accept-button";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
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
    <div>
      <h1>You've been invited</h1>
      <AcceptInviteButton token={inviteToken} />
    </div>
  );
}
