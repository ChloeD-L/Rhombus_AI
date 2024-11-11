"use client";

import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const dashboardPage = () => {
  const router = useRouter();
  const token = useUserContext();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center pt-24">
      <h1 className="text-2xl py-4">Dashboard</h1>
      <p>Welcome to the dashboard</p>
    </div>
  );
};

export default dashboardPage;
