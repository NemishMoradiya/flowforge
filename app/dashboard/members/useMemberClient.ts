"use client";

import { useState, useTransition, useMemo, useCallback } from "react";
import { inviteUser } from "@/features/invites/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Shield, Eye, UserPlus } from "lucide-react";

type Role = "admin" | "manager" | "client";

export const ROLE_INFO: Record<
  Role,
  {
    label: string;
    description: string;
    icon: any;
  }
> = {
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

interface UseMemberClientProps {
  currentUserRole: string;
}

export const useMemberClient = ({ currentUserRole }: UseMemberClientProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("client");
  const [loading, setLoading] = useState(false);
  const [lastToken, setLastToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isAdmin = useMemo(() => currentUserRole === "admin", [currentUserRole]);

  const inviteLink = useMemo(() => {
    if (!lastToken) return null;
    return `${window.location.origin}/invite?token=${lastToken}`;
  }, [lastToken]);

  const handleInvite = useCallback(async () => {
    if (!email.trim()) {
      toast.error("Enter email");
      return;
    }

    try {
      setLoading(true);

      const token = await inviteUser(email, role);

      setLastToken(token);
      setEmail("");
      toast.success("Invite sent");

      startTransition(() => {
        router.refresh();
      });
    } catch (e: any) {
      toast.error(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [email, role, router, startTransition]);

  const copyToken = useCallback(async () => {
    if (!inviteLink) return;

    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }, [inviteLink]);

  return {
    // state
    email,
    role,
    loading,
    lastToken,
    copied,
    isPending,
    inviteLink,
    isAdmin,

    // setters
    setEmail,
    setRole,

    // actions
    handleInvite,
    copyToken,

    // constants
    ROLE_INFO,

    // type
  };
};
