"use server";

import { cookies } from "next/headers";

export async function storeInviteToken(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("invite_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}
