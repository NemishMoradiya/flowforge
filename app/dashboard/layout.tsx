"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/useCurrentUser";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="mb-4">
        Logged in as: <b>{user.email}</b> ({user.role})
      </div>

      {children}
    </div>
  );
}
