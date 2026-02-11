import { acceptInvite } from "@/features/invites/acceptInvite";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-center">Invalid Invite</CardTitle>
            <CardDescription className="text-center">
              This invitation link is invalid or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=/invite?token=${token}`);
  }

  try {
    await acceptInvite(token);
  } catch (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-center">Invitation Error</CardTitle>
            <CardDescription className="text-center">
              This invitation could not be accepted. It may have expired or
              already been used.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  redirect("/dashboard");
}
