"use client";

import { updateUserRole } from "@/features/users/actions";

export default function UsersClient({ users }: { users: any[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Users</h2>

      {users.map((user) => (
        <div key={user.id} className="flex gap-4 items-center">
          <span className="w-64">{user.email}</span>

          <select
            value={user.role}
            onChange={(e) => updateUserRole(user.id, e.target.value)}
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
