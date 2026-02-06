"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/useCurrentUser";
import { useUsers } from "@/features/users/useUsers";
import { supabase } from "@/lib/supabase";

export default function UsersPage() {
  const router = useRouter();
  const { data: currentUser, isLoading } = useCurrentUser();
  const { data: users, mutate } = useUsers();
  console.log("🚀 ~ UsersPage ~ users:", users);

  useEffect(() => {
    if (!isLoading && currentUser?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser) return <div>Loading...</div>;

  async function updateRole(id: string, role: string) {
    await supabase.from("users").update({ role }).eq("id", id);
    mutate();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Users</h2>

      {users?.map((user: any) => (
        <div key={user.id} className="flex gap-4 items-center">
          <span className="w-64">{user.email}</span>

          <select
            value={user.role}
            onChange={(e) => updateRole(user.id, e.target.value)}
            className="border px-2 py-1"
          >
            <option value="client">client</option>
            <option value="manager">manager</option>
            <option value="admin">admin</option>
          </select>
        </div>
      ))}
    </div>
  );
}
