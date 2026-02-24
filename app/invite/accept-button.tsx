"use client";

import { acceptInvite } from "@/features/invites/acceptInvite";
import { useTransition } from "react";

export default function AcceptInviteButton({ token }: { token: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await acceptInvite(token);
        })
      }
    >
      {pending ? "Joining..." : "Accept Invitation"}
    </button>
  );
}
