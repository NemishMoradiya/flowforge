import { supabaseBrowser } from "@/lib/supabase/browser";
import { provisionUserOrg } from "./actions";

export async function register(
  email: string,
  password: string,
  token?: string | null,
) {
  const { data, error } = await supabaseBrowser.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // Only create org if this is NOT invite signup
  if (data.user && !token) {
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
