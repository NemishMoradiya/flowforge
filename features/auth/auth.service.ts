import { supabaseBrowser } from "@/lib/supabase/browser";
import { provisionUserOrg } from "./actions";

export async function register(email: string, password: string) {
  const { data, error } = await supabaseBrowser.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    await provisionUserOrg();
  }

  return data;
}

export async function login(email: string, password: string) {
  const { data, error } = await supabaseBrowser.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}
