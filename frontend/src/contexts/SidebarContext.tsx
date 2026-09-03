"use client";
import { createContext, useState } from "react";

type SidebarInfo = {
    name: string;
    profile: {
        initials: string;
        size: number;
    }
    navItems: {
      label: string;
      href: string;
    }[];
};

const sidebarInit = {
    name: "",
    profile: {
      initials: "",
      size: 50
    },
    navItems: [
      { label: "", href: ""},
    ]
  };

export const SidebarContext = createContext<SidebarInfo>(sidebarInit); 

// run a query to get the information for sidebar
const user = {
    name: "Anita M.",
    profile: {
      initials: "AM",
      size: 50
    },
    navItems: [
      { label: "Admin Settings", href: "/admin"},
      { label: "Exec Tools", href: "/executive-tools"},
      { label: "Events", href: "/events"},
      { label: "Playbook", href: "/playbook"},
      { label: "Roster", href: "/roster"},
      { label: "Resources", href: "/resources"},
      { label: "Feedback", href: "/feedback"}
    ]
  };


type MobileSidebarInfo= {
    isOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
};

// create context for sidebar
const mobileContextInit = {
        isOpen: false,
        openSidebar: () => {},
        closeSidebar: () => {}
    };

export const MobileSidebarContext = createContext<MobileSidebarInfo>(mobileContextInit);

export default function SidebarContentProvider(
{ children }: { children: React.ReactNode }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <SidebarContext.Provider value={user}>
            <MobileSidebarContext.Provider value={{    
                isOpen: sidebarOpen,
                openSidebar: () => setSidebarOpen(true),
                closeSidebar: () => setSidebarOpen(false)
            }}>
                { children }
            </MobileSidebarContext.Provider>
        </SidebarContext.Provider>
    );
};


