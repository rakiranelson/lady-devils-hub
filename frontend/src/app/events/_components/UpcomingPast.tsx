"use client";

import { useState, useRef, useEffect } from "react";

type props = {
    past: boolean;
    setPast: (past: boolean) => void;
};

export default function UpcomingPast({past, setPast}: props) {

    const upcomingRef = useRef<HTMLSpanElement>(null);
    const pastRef = useRef<HTMLSpanElement>(null);

    const [underlineStyle, setUnderlineStyle] = useState<{
                                                    left: number | undefined,
                                                    width: number | undefined,
                                                }>({ left: 0, width: 0 })

    useEffect(() => {
        const activeRef = past ? pastRef : upcomingRef;

        if (activeRef.current) {
            setUnderlineStyle({
                left: activeRef.current.offsetLeft,
                width: activeRef.current.offsetWidth,
            });
        }
    }, [past]);

    return (
        <div className="relative flex gap-7 text-muted-1 text-xl font-medium">
            <span ref={ upcomingRef } className={` hover:cursor-pointer transition-colors duration-500 select-none ${ !past ? "text-foreground font-semibold" : ""} `} onClick={() => setPast(false)}>
                Upcoming
            </span>

            <span ref={ pastRef } className={` hover:cursor-pointer transition-colors duration-500 select-none ${ past ? "text-foreground font-semibold" : ""} `} onClick={() => setPast(true)}>
                Past
            </span>

            <div className="absolute -bottom-2 h-[3px] bg-foreground transition-all duration-200" style={{ left: underlineStyle.left, width: underlineStyle.width }}>

            </div>
        </div>
    )
};