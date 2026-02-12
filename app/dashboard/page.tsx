import { getCurrentUser } from "@/features/auth/getCurrentUser";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Users, UserPlus, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) return null;

  const supabase = await createSupabaseServer();

  // Fetch stats based on role
  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", user.organizationId);

  let memberCount = 0;
  let inviteCount = 0;

  if (user.role === "admin") {
    const { count: mc } = await supabase
      .from("organization_members")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", user.organizationId);
    memberCount = mc ?? 0;

    const { count: ic } = await supabase
      .from("organization_invites")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", user.organizationId);
    inviteCount = ic ?? 0;
  }

  const stats = [
    {
      title: "Total Projects",
      value: projectCount ?? 0,
      icon: FolderKanban,
      href: "/dashboard/projects",
      description: "Active projects in your organization",
    },
    ...(user.role === "admin"
      ? [
          {
            title: "Team Members",
            value: memberCount,
            icon: Users,
            href: "/dashboard/users",
            description: "Members across your organization",
          },
          {
            title: "Pending Invites",
            value: inviteCount,
            icon: UserPlus,
            href: "/dashboard/members",
            description: "Invitations awaiting acceptance",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <Badge variant="secondary" className="capitalize">
            {user.role}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your organization&apos;s activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="group relative overflow-hidden transition-all hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
              <Link href={stat.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 -ml-2 gap-1 text-xs"
                >
                  View details
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks to manage your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/dashboard/projects">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FolderKanban className="h-4 w-4" />
                View Projects
              </Button>
            </Link>
            {user.role === "admin" && (
              <>
                <Link href="/dashboard/members">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Invite Members
                  </Button>
                </Link>
                <Link href="/dashboard/users">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
