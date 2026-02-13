import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const cookieStore = await cookies();

  cookieStore.set("invite_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.redirect(new URL("/invite", req.url));
}
