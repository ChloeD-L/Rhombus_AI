"use client";

import AuthTabs from "@/components/AuthTab";
import { useUserContext } from "@/context/UserContext";
import React, { useEffect } from "react";

export default function LoginPage() {
  const { setToken } = useUserContext();
  useEffect(() => {
    console.log("Clearing localStorage...");
    setToken("");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10">
      <h1 className="text-2xl font-medium">Welcome to the Data Cleaning Website</h1>
      <AuthTabs />
    </div>
  );
}
