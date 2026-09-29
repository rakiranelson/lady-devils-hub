"use client";

import { useState, useEffect } from "react";
import UpArrowIcon from "@/assets/icons/upArrow.svg";

type props = {
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollUp({ containerRef }: props){

    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const buffer = 1;
        const handleScroll = () => {
            setShowButton(container.scrollTop < buffer);
        };

        handleScroll();
        container.addEventListener("scroll", handleScroll);

        return () => container.removeEventListener("scroll", handleScroll);
    }, [ containerRef ]);

    const scrollTop = () => {
        containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div onClick={ scrollTop } className={` ${ showButton ? "hidden" : "block" } rounded-full bg-primary absolute bottom-0 right-1 flex justify-center items-center hover:cursor-pointer hover:bg-[hsl(242,73%,52%)] hover:shadow-profile`} style={{ width: 50, height: 50}}>
            <UpArrowIcon className="text-foreground text-[1.25rem]"/>
        </div>
    )
};