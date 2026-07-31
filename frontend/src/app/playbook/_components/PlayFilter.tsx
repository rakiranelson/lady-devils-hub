"use client";

import { useRef, useState, useEffect } from "react";

type props = {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
};

export default function PlayFilter({ activeFilter, setActiveFilter }: props) {

    const opt1Ref = useRef<HTMLDivElement>(null);
    const opt2Ref = useRef<HTMLDivElement>(null);
    // const opt3Ref = useRef<HTMLDivElement>(null);

    const [highlight, setHighlight] = useState<{
                                        left: number | undefined;
                                        width: number | undefined;
                                        top: number | undefined;
                                        height: number | undefined;
                                    }>({ left: undefined, width: undefined, top: undefined, height: undefined });

    useEffect(() => {
        const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
            "offense": opt1Ref,
            "defense": opt2Ref,
            // "Special Teams": opt3Ref,
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
        <div className="bg-navigation h-10 gap-2 text-[1.1rem] font-medium rounded-[10px] inline-flex flex-none relative self-start">
            <div ref={ opt1Ref } onClick={() => setActiveFilter("offense")} className={` h-full flex flex-none items-center px-6 z-5 hover:cursor-pointer select-none`}>
                Offense
            </div>
            <div ref={ opt2Ref } onClick={() => setActiveFilter("defense")} className={` h-full flex flex-none items-center px-6 z-5 hover:cursor-pointer select-none`}>
                Defense
            </div>
            {/* <div ref={ opt3Ref } onClick={() => setActiveFilter("Special Teams")} className={` h-full flex flex-none items-center px-6 z-5 hover:cursor-pointer select-none`}>
                Special Teams
            </div> */}

            <div className="absolute rounded-[10px] bg-primary transition-all duration-200" style={{ left: highlight.left, width: highlight.width, top: highlight.top, height: highlight.height }}></div>
        </div>
    )
};