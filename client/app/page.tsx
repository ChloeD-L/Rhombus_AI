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

    router.push("/dashboard");
  });

  return null;
}
