"use client";

import { useState } from "react";
import { inviteUser } from "@/features/invites/actions";
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
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Copy,
  Check,
  UserPlus,
  Shield,
  Eye,
} from "lucide-react";

const ROLE_INFO = {
  admin: {
    label: "Admin",
    description: "Full access to all features and settings",
    icon: Shield,
    badge: "destructive" as const,
  },
  manager: {
    label: "Manager",
    description: "Can manage projects and view team members",
    icon: UserPlus,
    badge: "default" as const,
  },
  client: {
    label: "Client",
    description: "View-only access to assigned projects",
    icon: Eye,
    badge: "secondary" as const,
  },
};

export default function MembersClient() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [lastToken, setLastToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentRole = ROLE_INFO[role as keyof typeof ROLE_INFO];

  async function handleInvite() {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    try {
      const token = await inviteUser(email, role);
      setLastToken(token);
      toast.success(`Invite sent to ${email}`);
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  }

  async function copyToken() {
    if (!lastToken) return;

    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/invite?token=${lastToken}`,
      );
      setCopied(true);
      toast.success("Invite link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invite Members</h1>
        <p className="text-muted-foreground">
          Send invitations to add new team members to your organization
        </p>
      </div>

      {/* Invite Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Invitation
          </CardTitle>
          <CardDescription>
            Enter the email address and role for the new member
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} disabled={loading}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ROLE_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <info.icon className="h-3.5 w-3.5" />
                      {info.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currentRole && (
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/50 p-3">
                <currentRole.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {currentRole.description}
                </p>
              </div>
            )}
          </div>

          <Button
            onClick={handleInvite}
            disabled={loading || !email}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending invite...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Invite Link Card */}
      {lastToken && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Check className="h-5 w-5" />
              Invite Link Generated
            </CardTitle>
            <CardDescription>
              Share this link with the invited member
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/invite?token=${lastToken}`}
                readOnly
                className="font-mono text-xs"
              />
              <Button variant="outline" size="icon" onClick={copyToken}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px]">
                24h
              </Badge>
              This link expires in 24 hours
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
