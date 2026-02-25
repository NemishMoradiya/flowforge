import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/getCurrentUser";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { debugPeople } from "@/features/users/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // if (!user) redirect("/login");

  await debugPeople("4010f0b6-5dcc-4273-ae1d-84fd958f5a0f");

  return (
    <DashboardShell user={{ email: user?.email ?? "", role: user?.role }}>
      {children}
    </DashboardShell>
  );
}
