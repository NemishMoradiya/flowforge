import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <DashboardShell user={{ email: user.email ?? "", role: user.role }}>
      {children}
    </DashboardShell>
  );
}
