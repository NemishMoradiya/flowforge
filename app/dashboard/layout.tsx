import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/getCurrentUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div className="p-6">
      <div className="mb-4">
        Logged in as: <b>{user.email}</b> ({user.role})
      </div>

      {children}
    </div>
  );
}
