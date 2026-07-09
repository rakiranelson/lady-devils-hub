"use client"

import SidebarContent from "@/components/SidebarContent";
import Link from "next/link";
import Image from "next/image";

export default function DesktopSidebar() {

    return (
        <div className=" hidden sidebar:flex flex-col fixed h-screen bg-navigation items-center sidebar:w-[min(16%,192px)] font-body shadow-sidebar">
            <Link href="/">
                <Image
                    className="dark:invert pt-10 pb-10"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={100}
                    height={20}
                    priority
                />
            </Link>
            <SidebarContent/>
        </div>
    );
};
