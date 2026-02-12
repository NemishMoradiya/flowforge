"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  user: {
    email: string;
    role: string;
  };
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/projects": "Projects",
  "/dashboard/members": "Invite Members",
  "/dashboard/users": "User Management",
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();

  const pageTitle = PAGE_TITLES[pathname] ?? "Dashboard";
  const initials = user.email?.slice(0, 2).toUpperCase() ?? "FF";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-5!" />

      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">{pageTitle}</h1>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-none">{user.email}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
