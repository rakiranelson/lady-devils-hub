"use client"

import Image from "next/image";
import ProfileIcon, { ProfileIconProps } from "@/components/ProfileIcon"

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

type SidebarProps = {
  items: NavItem[];
  name: string;
  profile: ProfileIconProps
};

export default function Sidebar({ items, name, profile}: SidebarProps) {

    const pathname = usePathname();
    
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

            <div className="flex flex-col w-full gap-1 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
                {items.map((item) => {

                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link href={ item.href } className={`rounded-md w-full text-center text-base p-1 hover:bg-primary hover:scale-102 transition-all ${ isActive ? "bg-muted-1" : ""}`} key={ item.label }>
                            { item.label }
                        </Link>
                    )
                })}
            </div>

            <div className="border-t-2 border-t-muted-1 mt-auto p-2 w-full flex items-center gap-2">
                <ProfileIcon initials={ profile.initials } size={ profile.size } />
                <div className="flex flex-col">
                    <span className="text-sm">{ name }</span>
                    <span className="text-sm text-muted-2"> Sign Out </span>
                </div>
            </div>
        </div>
    );
};
