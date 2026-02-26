"use client";

import { useState } from "react";
import { inviteUser } from "@/features/invites/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransition } from "react";
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
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Copy,
  Check,
  Shield,
  Eye,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

type Person = {
  id: string;
  email: string;
  role: string;
  status: "active" | "invited";
  created_at: string;
};

const ROLE_INFO = {
  admin: {
    label: "Admin",
    description: "Full access to all features and settings",
    icon: Shield,
  },
  manager: {
    label: "Manager",
    description: "Can manage projects and view team members",
    icon: UserPlus,
  },
  client: {
    label: "Client",
    description: "View-only access",
    icon: Eye,
  },
};

export default function MembersClient({
  people,
  currentUserRole,
}: {
  people: Person[];
  currentUserRole: string;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [lastToken, setLastToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const isAdmin = currentUserRole === "admin";
  async function handleInvite() {
    if (!email) return toast.error("Enter email");

    setLoading(true);

    try {
      const token = await inviteUser(email, role);
      setLastToken(token);
      toast.success("Invite sent");
      setEmail("");

      startTransition(() => {
        router.refresh();
      });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyToken() {
    if (!lastToken) return;

    await navigator.clipboard.writeText(
      `${window.location.origin}/invite?token=${lastToken}`,
    );

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* MEMBERS LIST */}

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Active members and pending invitations
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {isPending ? (
            <div className="text-xs text-muted-foreground flex justify-center items-center my-10">
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

      {/* INVITE FORM (ADMIN ONLY) */}

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
              <Select value={role} onValueChange={setRole}>
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

      {/* INVITE LINK */}

      {lastToken && (
        <Card>
          <CardContent className="space-y-2 pt-6">
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/invite?token=${lastToken}`}
              />
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
