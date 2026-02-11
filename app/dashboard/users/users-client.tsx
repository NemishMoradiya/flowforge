"use client";

import { useRouter } from "next/navigation";
import { updateUserRole } from "@/features/users/actions";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Users } from "lucide-react";

export default function UsersClient({ users }: { users: any[] }) {
  const router = useRouter();

  async function handleRoleChange(userId: string, newRole: string) {
    try {
      await updateUserRole(userId, newRole);
      toast.success("User role updated");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user role");
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive" as const;
      case "manager":
        return "default" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          View and manage user roles across the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
          <CardDescription>
            {users.length} {users.length === 1 ? "user" : "users"} registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={user.role}
                      onValueChange={(newRole) =>
                        handleRoleChange(user.id, newRole)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No users found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No users have registered yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
