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
import { toast } from "sonner";
import { Loader2, Mail, Copy, Check } from "lucide-react";

export default function MembersClient() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [lastToken, setLastToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invite Members</h1>
        <p className="text-muted-foreground">
          Send invitations to add new team members to your organization
        </p>
      </div>

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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} disabled={loading}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {role === "admin" && "Full access to all features and settings"}
              {role === "manager" &&
                "Can manage projects and view team members"}
              {role === "client" && "View-only access to assigned projects"}
            </p>
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

      {lastToken && (
        <Card>
          <CardHeader>
            <CardTitle>Invite Link Generated</CardTitle>
            <CardDescription>
              Share this link with the invited member
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}/invite?token=${lastToken}`}
                readOnly
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyToken}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This link expires in 24 hours
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
