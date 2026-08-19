"use client"
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/contexts/SidebarContext";
import { MobileSidebarContext } from "@/contexts/SidebarContext";
import { ModalContext } from "@/contexts/ModalContext";

import ProfileIcon from "@/components/ProfileIcon";
import LogoutIcon from "@/assets/icons/logout.svg";

import Link from "next/link";
import { usePathname } from "next/navigation";



export default function SidebarContent() {

    const pathname = usePathname();
    const [activePath, setActivePath] = useState("/");
    const user = useContext(SidebarContext);
    const mobile = useContext(MobileSidebarContext);
    const isModal = useContext(ModalContext);

    const items = user.navItems;
    const name = user.name;
    const profile = user.profile

    useEffect(() => {
        if (!isModal) {
            setActivePath(pathname)
        }
    }, [pathname, isModal])
    
    return (
        <>
            <div className="flex flex-col w-full gap-1 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
                {items.map((item) => {

                    const isActive = activePath.startsWith(item.href);

                    return (
                        <Link href={ item.href } onClick={mobile.closeSidebar} className={`rounded-sm w-full text-center text-base p-1 hover:bg-primary hover:scale-102 hover:rounded-md transition-all duration-80 ${ isActive ? "bg-muted-1" : ""}`} key={ item.label }>
                            { item.label }
                        </Link>
                    )
                })}
            </div>

            <div className="border-t-2 border-t-muted-1 mt-auto p-2 w-full flex items-center gap-2">
                <ProfileIcon initials={ profile.initials } size={ profile.size } />
                <div className="flex flex-col mt-1">
                    <span className="text-sm -mb-1">{ name }</span>
                    <div className="group hover:cursor-pointer">
                        <LogoutIcon className="inline text-muted-2 mb-0.5 -mr-0.5 group-hover:text-foreground"/>
                        <span className="text-sm text-muted-2 group-hover:text-foreground"> Sign Out </span>
                    </div>
                    
                </div>
            </div>
        </>
    );
};
