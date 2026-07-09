import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Rajdhani } from "next/font/google";
import "./globals.css";
import AppLayout from "@/app/AppLayout"
import SemesterProvider from "@/contexts/SemesterContext"
import SidebarContentProvider from "@/contexts/SidebarContext";

const plusJakartaSans  = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Lady Devils Hub",
  description: "Centralized platform for scheduling, attendance, tournaments, communication, and team coordination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <SemesterProvider>
        <SidebarContentProvider>
          <body className="h-screen flex scrollbar-thumb-muted-2 scrollbar-track-transparent overflow-hidden">
            <AppLayout>
              {children}
            </AppLayout>
          </body>
        </SidebarContentProvider>
      </SemesterProvider>
    </html>
  );
}
