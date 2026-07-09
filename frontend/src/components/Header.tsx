import { useContext } from "react";
import { MobileSidebarContext } from "@/contexts/SidebarContext";

type HeaderProps = {
    title: string;
    semester: string
}

export default function Header({ title, semester }: HeaderProps) {

    const mobile = useContext(MobileSidebarContext);

    return (
        <div className="h-18 w-full flex justify-between sticky top-0 bg-gradient-to-b from-background to-[hsl(231,30%,12%)] p-3 pl-5 pr-5 font-heading">
            <div className="flex">
                <button className="px-2 sidebar:hidden mt-1 mr-2 hover:bg-navigation hover:cursor-pointer" onClick={mobile.openSidebar}>
                    ☰
                </button>
                <div>
                    <p className="text-3xl">{ title }</p>
                    <p className="text-metadata pl-1 text-xs"> { semester } </p>
                </div>
            </div>
        
            <div className="pt-2">
                Action List
            </div>
        </div>
    );
};