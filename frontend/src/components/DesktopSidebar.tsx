"use client"

import SidebarContent from "@/components/SidebarContent";
import Link from "next/link";
import LadyDevilsLogo from "@/assets/LadyDevilsVectorFinal.svg";

export default function DesktopSidebar() {

    return (
        <div className=" hidden sidebar:flex flex-col fixed h-screen bg-navigation items-center sidebar:w-[min(16%,192px)] font-body shadow-sidebar">
            <Link href="/" title="Homepage">
                <LadyDevilsLogo className="w-[6.5rem] h-auto pt-3 hover:scale-105 transition-transform"/>
            </Link>
            <SidebarContent/>
        </div>
    );
};
