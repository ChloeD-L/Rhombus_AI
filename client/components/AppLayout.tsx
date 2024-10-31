"use client";

import React, { ReactNode } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import DescriptionIcon from "@mui/icons-material/Description";
import { createTheme } from "@mui/material/styles";

const demoTheme = createTheme({
  // Customize the theme as needed
});

interface AppLayoutProps {
  children: ReactNode;
  initialPath?: string;
}

const NAVIGATION = [
  {
    segment: "home",
    title: "Home",
    icon: <DescriptionIcon />,
  },
  {
    segment: "about",
    title: "About Us",
    icon: <DescriptionIcon />,
  },
  // Add more navigation items as needed
];

function AppLayout({ children, initialPath = "/home" }: AppLayoutProps) {
  const router = useDemoRouter(initialPath);

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
      <DashboardLayout>{children}</DashboardLayout>
    </AppProvider>
  );
}

export default AppLayout;
