import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Rajdhani } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"
import SemesterProvider from "@/contexts/SemesterContext"

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

  const navItems = [
    { label: "Admin Settings", href: "/admin"},
    { label: "Team Logistics", href: "/logistics"},
    { label: "Practices", href: "/practices"},
    { label: "Competitions", href: "/competitions"},
    { label: "Club Events", href: "/club-events"},
    { label: "Playbook", href: "/playbook"},
    { label: "Members", href: "/members"},
    { label: "Resources", href: "/resources"},
    { label: "Feedback", href: "/feedback"}
    
  ];

  const name = "Anita M.";

  const profile = {
    initials: "AM",
    size: 50
  };


  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <SemesterProvider>
        <body className="h-screen flex scrollbar-thumb-muted-2 scrollbar-track-transparent overflow-hidden">
          <Sidebar items={ navItems } name={ name } profile={ profile } />

          <main className="bg-background w-full md:ml-48 font-body">
            {children}
          </main>
        </body>
      </SemesterProvider>
    </html>
  );
}
