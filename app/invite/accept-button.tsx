"use client";

import { acceptInvite } from "@/features/invites/acceptInvite";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function AcceptInviteButton({ token }: { token: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await acceptInvite(token);
          router.push("/dashboard");
        })
      }
      className="w-full rounded-md bg-primary dark:text-dark px-4 py-2 text-primary-foreground font-medium transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
    >
      {pending ? "Joining organization..." : "Accept Invitation"}
    </button>
  );
}
