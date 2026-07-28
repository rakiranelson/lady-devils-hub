"use client";

import { useState, useRef, useEffect } from "react";

type props = {
    upcoming: boolean;
    setUpcoming: (upcoming: boolean) => void;
};

export default function UpcomingPast({upcoming, setUpcoming}: props) {

    const upcomingRef = useRef<HTMLSpanElement>(null);
    const pastRef = useRef<HTMLSpanElement>(null);

    const [underlineStyle, setUnderlineStyle] = useState<{
                                                    left: number | undefined,
                                                    width: number | undefined,
                                                }>({ left: 0, width: 0 })

    useEffect(() => {
        const activeRef = upcoming ? upcomingRef : pastRef;

        if (activeRef.current) {
            setUnderlineStyle({
                left: activeRef.current.offsetLeft,
                width: activeRef.current.offsetWidth,
            });
        }
    }, [upcoming]);

    return (
        <div className="relative flex gap-7 text-muted-1 text-xl font-medium">
            <span ref={ upcomingRef } className={` hover:cursor-pointer transition-colors duration-500 select-none ${ upcoming ? "text-foreground font-semibold" : ""} `} onClick={() => setUpcoming(true)}>
                Upcoming
            </span>

            <span ref={ pastRef } className={` hover:cursor-pointer transition-colors duration-500 select-none ${ !upcoming ? "text-foreground font-semibold" : ""} `} onClick={() => setUpcoming(false)}>
                Past
            </span>

            <div className="absolute -bottom-2 h-[3px] bg-foreground transition-all duration-200" style={{ left: underlineStyle.left, width: underlineStyle.width }}>

            </div>
        </div>
    )
};