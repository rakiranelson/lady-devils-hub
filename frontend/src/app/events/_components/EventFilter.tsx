"use client";

import { useRef, useState, useEffect } from "react";

type props = {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
};

export default function EventFilter({ activeFilter, setActiveFilter }: props) {

    const opt1Ref = useRef<HTMLDivElement>(null);
    const opt2Ref = useRef<HTMLDivElement>(null);
    const opt3Ref = useRef<HTMLDivElement>(null);
    const opt4Ref = useRef<HTMLDivElement>(null);


    const [highlight, setHighlight] = useState<{
                                        left: number | undefined;
                                        width: number | undefined;
                                        top: number | undefined;
                                        height: number | undefined;
                                    }>({ left: undefined, width: undefined, top: undefined, height: undefined });

    useEffect(() => {
        const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
            "All": opt1Ref,
            "Practices": opt2Ref,
            "Competitions": opt3Ref,
            "Club Events": opt4Ref,
        };

        const activeRef = refMap[activeFilter] ?? opt1Ref;

        if (activeRef.current) {
            setHighlight({
                left: activeRef.current.offsetLeft,
                width: activeRef.current.offsetWidth,
                top: activeRef.current.offsetTop,
                height: activeRef.current.offsetHeight,
            });
        }
    }, [activeFilter]);
    
    return (
        <div className="bg-navigation h-10 flex gap-2 text-[1.1rem] font-medium rounded-[10px] flex-none relative ">
            <div ref={ opt1Ref } onClick={() => setActiveFilter("All")} className={` h-full flex flex-none items-center px-6 z-5 hover:cursor-pointer select-none`}>
                All
            </div>
            <div ref={ opt2Ref } onClick={() => setActiveFilter("Practices")} className={` h-full flex flex-none items-center px-6 z-5 hover:cursor-pointer select-none`}>
                Practices
            </div>
            <div ref={ opt3Ref } onClick={() => setActiveFilter("Competitions")} className={` h-full flex flex-none items-center px-6 z-5 hover:cursor-pointer select-none`}>
                Competitions
            </div>
            <div ref={ opt4Ref } onClick={() => setActiveFilter("Club Events")} className={` h-full flex flex-none items-center px-6 z-5 hover:cursor-pointer select-none`}>
                Club Events
            </div>

            <div className="absolute rounded-[10px] bg-primary transition-all duration-200" style={{ left: highlight.left, width: highlight.width, top: highlight.top, height: highlight.height }}></div>
        </div>
    )
};