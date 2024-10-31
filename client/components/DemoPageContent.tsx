"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface PageContentProps {
  pathname: string;
  title: string;
  description?: string;
}

function DemoPageContent({ pathname, title, description }: PageContentProps) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Typography variant="caption">Path: {pathname}</Typography>
    </Box>
  );
}

export default DemoPageContent;
