"use client";

import useSWR from "swr";
import { supabase } from "@/lib/supabase";

async function fetchUsers() {
  const { data, error } = await supabase.from("users").select("*");

  if (error) throw error;

  return data;
}

export function useUsers() {
  return useSWR("users", fetchUsers);
}
