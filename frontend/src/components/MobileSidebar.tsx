"use client"

import { useContext, useEffect } from "react";
import SidebarContent from "@/components/SidebarContent";
import { MobileSidebarContext } from "@/contexts/SidebarContext";
import useMediaQuery from "@/hooks/useMediaQuery";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


export default function MobileSidebar() {
    const mobile = useContext(MobileSidebarContext);

    const pathname = usePathname();
    const isDesktop = useMediaQuery("(min-width: 850px)")

    useEffect(() => {
        mobile.closeSidebar();
    }, [isDesktop, pathname])
    
    return (
        <>
            { mobile.isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-2 sidebar:hidden transition-all duration-500"
                    onClick={mobile.closeSidebar}
                />
            )}

            <div className={` sidebar:hidden flex flex-col fixed h-screen z-3 bg-navigation items-center w-[192px] font-body shadow-sidebar transition-transform ${mobile.isOpen === true ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="mt-2 flex w-full">
                    <Link href="/" onClick={mobile.closeSidebar}>
                        <Image
                            className="dark:invert pb-10 pt-5 px-2 ml-1"
                            src="/next.svg"
                            alt="Next.js logo"
                            width={100}
                            height={20}
                            priority
                        />
                    </Link>
                    <button className="sidebar:hidden mr-2 hover:bg-black/10 hover:cursor-pointer ml-auto mb-auto mt-4" onClick={mobile.closeSidebar}>
                        X
                    </button>
                </div>
                <SidebarContent/>
            </div>
        </>
    );
};
