"use client"; 

import { useState, useRef, useEffect} from "react";
import DropDownIcon from "@/assets/icons/dropDown.svg";
import SelectCheckIcon from "@/assets/icons/selectCheck.svg";
import useScrollFade from "@/hooks/useScrollFade";

type FilterProps = {
    season: string;
    onChange: (season: string) => void;
    seasons: string[]
}

export default function SeasonFilter({ season, onChange, seasons }: FilterProps) {

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // close when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    // close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    const handleSelect = (season: string) => {
        onChange(season);
        setIsOpen(false);
    };

    const { scrollContainer, showFade, handleScroll } = useScrollFade<HTMLDivElement>( [isOpen] );

    return (
        <div ref={ containerRef } className="relative flex-none">

            <div onClick={() => setIsOpen((prev) => !prev)} className="bg-muted-1 min-w-26 h-9 inline-flex items-center justify-center rounded-[8px] px-3 gap-2 group hover:cursor-pointer select-none">
                <span className="text-lg font-medium">{ season }</span>
                <DropDownIcon className={` text-[0.75rem] text-foreground/75 group-hover:text-foreground ${ isOpen ? "rotate-180 mb-0.5" : "rotate-0" } transition-transform duration-200`}/>
            </div>

            { isOpen && (
                <div className="bg-background border-1 border-muted-1/70 mt-2 w-38 absolute top-full z-20 rounded-[8px] overflow-hidden select-none">
                    <div ref={ scrollContainer } onScroll={ handleScroll } className="max-h-36 overflow-y-auto scrollbar-thin">
                        { seasons.map((s) => (
                            <div 
                                key={ s } onClick={() => handleSelect(s)}
                                className={` flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-primary`}>
                                    <SelectCheckIcon className={` ${ s === season ? "inline-block -mt-0.5 text-[.7rem]" : "hidden"} `}/>
                                    <span className={` text-lg font-medium ${ s != season ? "pl-6" : "font-semibold"} `}>{ s }</span>
                            </div>
                        ))}
                    </div>

                    { showFade && (
                        <div className="pointer-events-none absolute w-full bottom-0 h-10 bg-gradient-to-t from-background to-transparent"></div>
                    )}
                </div>
            ) }
        </div>

    )
};