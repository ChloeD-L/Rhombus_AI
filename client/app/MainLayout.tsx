"use client";

// import { useSidebar } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  // const { open } = useSidebar();
  const open = false;

  return <div className={`transition-all duration-300 ${open ? "ml-16" : "w-full h-full"}`}>{children}</div>;
}
