"use client";

import useSWR from "swr";
import { supabase } from "@/lib/supabase";

async function fetchUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export function useCurrentUser() {
  return useSWR("current-user", fetchUser);
}
