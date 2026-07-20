"use client";

import DesktopSidebar from "@/components/DesktopSidebar";
import MobileSidebar from "@/components/MobileSidebar";

type AppLayoutProps = {
  children: React.ReactNode;
  user: {
    name: string;
    profile: {
      initials: string;
      size: number;
    };
    navItems: {
      label: string;
      href: string;
    }[];
  };
};

export default function AppLayout({ children }
  : Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar/>

      <main className="min-w-0 bg-background w-full sidebar:ml-[min(16%,192px)] font-body">
        {children}
      </main>
    </>
  );
}
