"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Copy, Check } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useMemberClient } from "./useMemberClient";

type Person = {
  id: string;
  email: string;
  role: string;
  status: "active" | "invited";
  created_at: string;
};

type Role = "admin" | "manager" | "client";

export default function MembersClient({
  people,
  currentUserRole,
}: {
  people: Person[];
  currentUserRole: string;
}) {
  const {
    email,
    role,
    loading,
    lastToken,
    copied,
    isPending,
    inviteLink,
    isAdmin,
    setEmail,
    setRole,
    handleInvite,
    copyToken,
    ROLE_INFO,
  } = useMemberClient({ currentUserRole });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Active members and pending invitations
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {isPending ? (
            <div className="flex justify-center my-10">
              <Spinner className="size-6" />
            </div>
          ) : (
            people.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{p.email}</p>
                  <p className="text-xs text-muted-foreground">{p.role}</p>
                </div>

                <Badge
                  variant={p.status === "active" ? "default" : "secondary"}
                >
                  {p.status}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Invite Member</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as Role)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {Object.keys(ROLE_INFO).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleInvite} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Invite
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {lastToken && inviteLink && (
        <Card>
          <CardContent className="space-y-2 pt-6">
            <div className="flex gap-2">
              <Input readOnly value={inviteLink} />
              <Button size="icon" variant="outline" onClick={copyToken}>
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
