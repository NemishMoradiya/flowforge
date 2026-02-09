import { getCurrentUser } from "@/features/auth/getCurrentUser";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) return null;

  if (user.role === "admin") {
    return <div>Admin Dashboard</div>;
  }

  if (user.role === "manager") {
    return <div>Manager Dashboard</div>;
  }

  return <div>Client Dashboard</div>;
}
