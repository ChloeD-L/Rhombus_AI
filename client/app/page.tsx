"use client";

import Image from "next/image";

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import AppLayout from "@/components/AppLayout";
// import DemoPageContent from "@/components/DemoPageContent";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }: { pathname: string }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    ></Box>
  );
}

interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  // window?: () => Window;
}

export default function Home(props: DemoProps) {
  // return (
  //   <AppLayout initialPath="/home">
  //     <DemoPageContent pathname="/home" title="Home Page" description="Welcome to the Home Page!" />
  //   </AppLayout>
  // );
  const router = useDemoRouter("/home");
  return (
    // preview-start
    <AppProvider
      navigation={[
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
      ]}
      router={router}
      theme={demoTheme}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}
