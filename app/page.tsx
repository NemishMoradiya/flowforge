"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  useEffect(() => {
    supabase.auth.getSession().then(console.log);
  }, []);

  return <div>Supabase test</div>;
}
