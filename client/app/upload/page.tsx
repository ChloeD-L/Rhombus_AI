"use client";

import AuthTabs from "@/components/AuthTab";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";

export default function HomePage() {
  const { token, setToken } = useUserContext();
  const router = useRouter();
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10">
      <h1 className="text-2xl font-medium">upload</h1>
    </div>
  );
}
