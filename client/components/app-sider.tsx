"use client";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/context/UserContext";
import { useEffect } from "react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Upload",
    url: "upload",
    icon: Inbox,
  },
];

export function AppSidebar() {
  const { setOpen } = useSidebar();
  const { token } = useUserContext();

  console.log("checkToken", token);

  console.log("checkTokenafter", token);

  useEffect(() => {
    // 如果没有 token，隐藏 Sidebar
    if (!token) {
      console.log("token", token);
      setOpen(false);
    }
    setOpen(true);
  }, [token, setOpen]);

  if (!token) {
    console.log("1111", token);
    return null;
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
