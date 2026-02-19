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
import useMemberClient from "./useMemberClient";

export default function MembersClient() {
  const {
    ROLE_INFO,
    email,
    setEmail,
    role,
    setRole,
    loading,
    lastToken,
    copied,
    handleInvite,
    copyToken,
    currentRole,
  } = useMemberClient();

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
