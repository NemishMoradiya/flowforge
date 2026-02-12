import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ArrowRight,
  FolderKanban,
  Users,
  Shield,
  Workflow,
} from "lucide-react";

const FEATURES = [
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Create, organize, and track projects across your entire organization",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite team members with role-based access control",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Fine-grained permissions for admins, managers, and clients",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Streamline your client onboarding with automated workflows",
  },
];

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-border/40 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">FlowForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col">
        <section className="flex flex-1 flex-col items-center justify-center px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
              <Zap className="h-3.5 w-3.5" />
              Streamline your client workflows
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Client Onboarding &{" "}
              <span className="bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                Workflow Management
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              FlowForge helps teams manage client onboarding, project workflows,
              and team collaboration — all in one powerful platform.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" className="gap-2 px-8">
                  Start for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="border-t border-border/40 bg-muted/30 px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Everything you need to manage clients
              </h2>
              <p className="text-muted-foreground">
                Powerful features built for modern teams
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-sm"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 px-6 py-8">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-3.5 w-3.5" />
              FlowForge
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} FlowForge. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
