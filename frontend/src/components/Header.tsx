import { useContext } from "react";
import { MobileSidebarContext } from "@/contexts/SidebarContext";
import HamburgerIcon from "@/assets/icons/hamburger.svg";
import ChecklistIcon from "@/assets/icons/checklist.svg";
import AlertIcon from "@/assets/icons/alert.svg";

type HeaderProps = {
    title: string;
    semester: string
}

export default function Header({ title, semester }: HeaderProps) {

    const mobile = useContext(MobileSidebarContext);

    return (
        <div className="h-18 w-full flex justify-between sticky top-0 z-50 bg-gradient-to-b from-background to-[hsl(231,30%,12%)] p-3 pl-5 pr-5 font-heading select-none">
            <div className="flex">
                <button className="sidebar:hidden px-1 mr-2 hover:cursor-pointer" onClick={mobile.openSidebar}>
                    <HamburgerIcon className="w-[2rem] h-auto -mt-2"/>
                </button>
                <div>
                    <p className="text-3xl">{ title }</p>
                    <p className="text-metadata pl-1 text-xs"> { semester } Season</p>
                </div>
            </div>
        
            <div className="flex items-center hover:cursor-pointer group relative p-2">
                <ChecklistIcon className="text-[1.6rem] text-foreground/40 group-hover:text-foreground/80"/>
                <AlertIcon className="text-background text-[1rem] absolute top-1.5 right-0 animate-beat"/>
            </div>
        </div>
    );
};