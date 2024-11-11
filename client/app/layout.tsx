import localFont from "next/font/local";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sider";
import { Metadata } from "next";
import MainLayout from "./MainLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Infer and convert data types",
  description: "Infer and convert data types",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          {" "}
          <SidebarProvider>
            <AppSidebar />
            <MainLayout>{children}</MainLayout>
          </SidebarProvider>
        </UserProvider>
      </body>
    </html>
  );
}
