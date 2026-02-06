"use client";

import useSWR from "swr";
import { supabase } from "@/lib/supabase";

async function fetchProjects() {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) throw error;

  return data;
}

export function useProjects() {
  return useSWR("projects", fetchProjects);
}
