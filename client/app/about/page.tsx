"use client";

import AppLayout from "@/components/AppLayout";
import DemoPageContent from "@/components/DemoPageContent";
import React from "react";

export default function About() {
  return (
    <AppLayout initialPath="/about">
      <DemoPageContent pathname="/about" title="About Us" description="Learn more about us on this page." />
    </AppLayout>
  );
}
