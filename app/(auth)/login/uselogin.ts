"use client";
import { login } from "@/features/auth/auth.service";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const uselogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }
  return {
    handleSubmit,
    email,
    setEmail,
    password,
    setPassword,
    loading,
  };
};

export default uselogin;
