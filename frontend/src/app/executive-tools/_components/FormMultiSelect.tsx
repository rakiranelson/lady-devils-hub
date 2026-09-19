"use client"; 

import { useState, useRef, useEffect} from "react";
import DropDownIcon from "@/assets/icons/dropDown.svg";
import SelectCheckIcon from "@/assets/icons/selectCheck.svg";
import useScrollFade from "@/hooks/useScrollFade";

type FormProps = {
    formName? : string;
    required? : boolean
}

export default function FormMultiSelect({ formName, required = false } : FormProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
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

    // close on enter
    // add here

    const handleSelect = (option: string) => {
        if (!selected.includes(option)) {
            setSelected([...selected, option]);
        } else {
            setSelected(selected.filter(s => s !== option));
        }
    };

    const { scrollContainer, showFade, handleScroll } = useScrollFade<HTMLDivElement>( [isOpen] );

    const options = ["Group\u00A0Transportation", "Lodging"]

    return (
        <div className="flex flex-col">
            <div>
                <span className={` ${ formName ? "select-none" : "invisible"} `}>{ formName ? formName : "invisible" }</span>
                { required && (
                    <span className="text-alert font-bold ml-1">*</span>
                ) }
            </div>
            
            
            <div ref={ containerRef } className="relative flex-none mt-1 w-1/2">

                <div onClick={() => setIsOpen((prev) => !prev)} className={` bg-muted-1/50 inline-flex items-center justify-center w-full rounded-[5px] outline-2 outline-card px-2 py-1 gap-2 group hover:cursor-pointer select-none ${ isOpen ? "outline-primary" : "" } transition-all`}>
                    <span className="text-[1.05rem] mr-auto">
                        {selected.length === 0 ? (
                            <span className="text-foreground/25">Select all that apply</span>
                        ) : (
                            selected.join(", ")
                        )}
                    </span>
                    <DropDownIcon className={` text-[0.75rem] text-foreground/25 group-hover:text-foreground ${ isOpen ? "rotate-180 mb-0.5" : "rotate-0" } transition-transform duration-200`}/>
                </div>

                { isOpen && (
                    <div className="bg-card outline-1 outline-muted-1/50 w-full absolute top-0 left-full ml-2 z-20 rounded-[8px] overflow-hidden select-none">
                        <div ref={ scrollContainer } onScroll={ handleScroll } className="max-h-50 overflow-y-auto scrollbar-thin">
                            { options.map((opt) => (
                                <div 
                                    key={ opt } onClick={() => handleSelect(opt)}
                                    className={` flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-primary `}>
                                        <span className={` ${ !selected.includes(opt) ? "" : "font-semibold"} `}>{ opt }</span>
                                        <SelectCheckIcon className={` ${ selected.includes(opt) ? "inline-block -mt-0.5 ml-auto text-[.7rem]" : "hidden"} `}/>
                                        
                                </div>
                            ))}
                        </div>

                        { showFade && (
                            <div className="pointer-events-none absolute w-full bottom-0 h-10 bg-gradient-to-t from-background to-transparent"></div>
                        )}
                    </div>
                ) }
            </div>
        </div>

    )
};