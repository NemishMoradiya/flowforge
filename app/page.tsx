import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const user = await getCurrentUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  // Landing page for logged-out users
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <span className="text-3xl font-bold text-primary-foreground">
              F
            </span>
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Welcome to FlowForge
        </h1>

        <p className="mb-8 text-lg text-muted-foreground">
          Professional SaaS Client Onboarding & Workflow Management
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
