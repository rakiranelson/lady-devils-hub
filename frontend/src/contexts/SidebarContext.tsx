"use client";
import { createContext, useState, useContext } from "react";
import { UserContext } from "@/contexts/CurrentUserContext";

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
    const isExec = useContext(UserContext)?.exec;

    const user = isExec
    ? {
        name: "Exec Profile",
        profile: { initials: "EP", size: 50 },
        navItems: [
          { label: "Exec Tools", href: "/executive-tools" },
          { label: "Events", href: "/events" },
          { label: "Playbook", href: "/playbook" },
        ],
      }
    : {
        name: "Player Profile",
        profile: {
          initials: "PP",
          size: 50
        },
        navItems: [
          { label: "Events", href: "/events"},
          { label: "Playbook", href: "/playbook"},
        ]
      }
      
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
