"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/features/auth/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await register(email, password);

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-sm">
      <input
        className="border p-2 w-full"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border p-2 w-full"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-black text-white px-4 py-2">Register</button>
    </form>
  );
}
