"use client";

import { useRef, useState, useEffect } from "react";
import { responses } from "./RSVPList";
import { StatusPill } from "../StatusPill";
import useScrollFade from "@/hooks/useScrollFade";

type props = {
    rsvp: responses
};

export default function RVSPTable({ rsvp }: props) {

    const [activeTab, setActiveTab] = useState("attending");

    const attendingRef = useRef<HTMLSpanElement>(null);
    const maybeRef = useRef<HTMLSpanElement>(null);
    const noRef = useRef<HTMLSpanElement>(null);
    const pendingRef = useRef<HTMLSpanElement>(null);

    const [underlineStyle, setUnderlineStyle] = useState<{
                                                    left: number | undefined,
                                                    width: number | undefined,
                                                }>({ left: 0, width: 0 })

                                                
    useEffect(() => {
        const refMap: Record<string, React.RefObject<HTMLSpanElement | null>>  = {
            "attending": attendingRef,
            "maybe": maybeRef,
            "no": noRef,
            "pending": pendingRef,
        };

        const activeRef = refMap[activeTab] ?? attendingRef;

        if (activeRef.current) {
            setUnderlineStyle({
                left: activeRef.current.offsetLeft,
                width: activeRef.current.offsetWidth,
            });
        }
    }, [activeTab]);

      const { scrollContainer, showFade, handleScroll } = useScrollFade<HTMLDivElement>();

    return (
        <div className="w-full flex flex-col relative">
            <div className="p-3 border-b border-muted-1/50">
                <div className={` relative flex gap-7 text-foreground/35 text-[min(1.1rem,2.9vw)] font-medium px-2 ${ "no" in rsvp ? "justify-between" : "gap-10"}`}>
                    <span ref={ attendingRef } className={` hover:cursor-pointer transition-colors duration-400 select-none ${ activeTab === "attending" ? "text-foreground font-semibold" : ""} `} onClick={() => setActiveTab("attending")}>
                        {`Attending`}
                    </span>

                    <span ref={ maybeRef } className={` hover:cursor-pointer transition-colors duration-500 select-none ${ activeTab === "maybe" ? "text-foreground font-semibold" : ""} `} onClick={() => setActiveTab("maybe")}>
                        {`Maybe`}
                    </span>

                    { "no" in rsvp && (
                        <span ref={ noRef } className={` hover:cursor-pointer transition-colors duration-500 select-none ${ activeTab === "no" ? "text-foreground font-semibold" : ""} `} onClick={() => setActiveTab("no")}>
                            {`No`}
                        </span>
                    )}

                    { "pending" in rsvp && (
                        <span ref={ pendingRef } className={` hover:cursor-pointer transition-colors duration-500 select-none ${ activeTab === "pending" ? "text-foreground font-semibold" : ""} `} onClick={() => setActiveTab("pending")}>
                            {`Pending`}
                        </span>
                    )}
                            
                    <div className="absolute -bottom-1 h-[3px] bg-foreground transition-all duration-200" style={{ left: underlineStyle.left, width: underlineStyle.width }}/>
                    </div>
                </div>

            <div ref={ scrollContainer } onScroll={ handleScroll } className="text-[min(1rem,3vw)] py-3 px-5 overflow-y-auto">
                { activeTab === "attending" && (
                    <div className="flex justify-between">
                        <div className="flex flex-col tracking-wider leading-[2.4rem] text-foreground/70 font-medium">
                        { rsvp.yes?.map((player) => (
                            <div key={ player.id }>
                                { player.name }
                            </div>
                        ))}
                        </div>
                    
                        <div className="flex-none">
                            <StatusPill display={ rsvp.yes?.length + ` Players` }/>
                        </div>
                    </div>
                )}

                { activeTab === "maybe" && (
                    <div className="flex justify-between">
                        <div className="flex flex-col text-base tracking-wider leading-[2.4rem] text-foreground/70 font-medium">
                        { rsvp.maybe?.map((player) => (
                            <div key={ player.id }>
                                { player.name }
                            </div>
                        ))}
                        </div>
                    
                        <div className="flex-none">
                            <StatusPill display={ rsvp.maybe?.length + ` Players` }/>
                        </div>
                    </div>
                )}

                { activeTab === "no" && "no" in rsvp && (
                    <div className="flex justify-between">
                        <div className="flex flex-col text-base tracking-wider leading-[2.4rem] text-foreground/70 font-medium">
                        { rsvp.no?.map((player) => (
                            <div key={ player.id }>
                                { player.name }
                            </div>
                        ))}
                        </div>
                    
                        <div className="flex-none">
                            <StatusPill display={ rsvp.no?.length + ` Players` }/>
                        </div>
                    </div>
                )}

                { activeTab === "pending" && "pending" in rsvp && (
                    <div className="flex justify-between">
                        <div className="flex flex-col text-base tracking-wider leading-[2.4rem] text-foreground/70 font-medium">
                        { rsvp.pending?.map((player) => (
                            <div key={ player.id }>
                                { player.name }
                            </div>
                        ))}
                        </div>
                    
                        <div className="flex-none">
                            <StatusPill display={ rsvp.pending?.length + ` Players` }/>
                        </div>
                    </div>
                )}
            </div>

            <div className={`pointer-events-none absolute w-full bottom-0 h-11 bg-gradient-to-t from-card to-transparent transition-opacity duration-200 ${ showFade ? "opacity-100" : "opacity-0"}`}/>

        </div>
    )
};