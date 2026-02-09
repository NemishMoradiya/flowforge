"use client";
import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function Home() {
  useEffect(() => {
    supabaseBrowser.auth.getSession().then(console.log);
  }, []);

  return <div>Supabase test</div>;
}
