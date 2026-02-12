"use client";

import useSWR from "swr";
import { supabaseBrowser } from "@/lib/supabase/browser";

async function fetchUsers() {
  const { data, error } = await supabaseBrowser.from("users").select("*");

  if (error) throw error;

  return data;
}

export function useUsers() {
  return useSWR("users", fetchUsers);
}
