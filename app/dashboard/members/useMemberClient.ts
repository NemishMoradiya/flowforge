import { inviteUser } from "@/features/invites/actions";
import { Eye, Shield, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

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

const useMemberClient = () => {
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
  return {
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
  };
};

export default useMemberClient;
