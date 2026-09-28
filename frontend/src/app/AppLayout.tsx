"use client";

import DesktopSidebar from "@/components/DesktopSidebar";
import MobileSidebar from "@/components/MobileSidebar";


export default function AppLayout({ children, modal }
  : Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {

  return (
    <>
      <DesktopSidebar/>
      <MobileSidebar/>
      
      <main className="min-w-0 bg-background w-full sidebar:ml-[min(17%,192px)] font-body">
        {children}
        {modal}
      </main>
    </>
  );
}
