import AuthTabs from "@/components/AuthTab";
import React from "react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10">
      <h1 className="text-2xl font-medium">Welcome to data cleaning website</h1>
      <AuthTabs />
    </div>
  );
}
