"use client";

import { useCurrentUser } from "@/features/auth/useCurrentUser";

export default function Dashboard() {
  const { data: user } = useCurrentUser();

  if (!user) return null;

  if (user.role === "admin") {
    return <div>Admin Dashboard</div>;
  }

  if (user.role === "manager") {
    return <div>Manager Dashboard</div>;
  }

  return <div>Client Dashboard</div>;
}
