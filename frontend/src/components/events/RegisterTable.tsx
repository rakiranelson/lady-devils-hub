"use client";

import { useRef, useState, useEffect } from "react";
import { responses } from "./RSVPList";
import { StatusPill } from "../StatusPill";
import useScrollFade from "@/hooks/useScrollFade";

type props = {
    responses: responses
};

export default function RegisterTable({ responses }: props) {

    const [activeTab, setActiveTab] = useState("registered");

    const registeredRef = useRef<HTMLSpanElement>(null);
    const notRegisteredRef = useRef<HTMLSpanElement>(null);
    const noResponseRef = useRef<HTMLSpanElement>(null);

    const [underlineStyle, setUnderlineStyle] = useState<{
                                                    left: number | undefined,
                                                    width: number | undefined,
                                                }>({ left: 0, width: 0 })

                                                
    useEffect(() => {
        const refMap: Record<string, React.RefObject<HTMLSpanElement | null>>  = {
            "registered": registeredRef,
            "not registered": notRegisteredRef,
            "no response": noResponseRef,
        };

        const activeRef = refMap[activeTab] ?? registeredRef;

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
                <div className={` relative flex gap-7 text-foreground/35 text-[min(1.1rem,2.9vw)] font-medium px-2 ${ "notRegistered" in responses ? "justify-between" : "gap-10"}`}>
                    <span ref={ registeredRef } className={` hover:cursor-pointer transition-colors duration-400 select-none ${ activeTab === "registered" ? "text-foreground font-semibold" : ""} `} onClick={() => setActiveTab("registered")}>
                        {`Registered`}
                    </span>

                    { "notRegistered" in responses && (
                        <span ref={ notRegisteredRef } className={` hover:cursor-pointer transition-colors duration-500 select-none ${ activeTab === "not registered" ? "text-foreground font-semibold" : ""} `} onClick={() => setActiveTab("not registered")}>
                        {`Not Attending`}
                    </span>
                    )}
                    

                    { "noResponse" in responses && (
                        <span ref={ noResponseRef } className={` hover:cursor-pointer transition-colors duration-500 select-none ${ activeTab === "no response" ? "text-foreground font-semibold" : ""} `} onClick={() => setActiveTab("no response")}>
                            {`No Response`}
                        </span>
                    )}
                            
                    <div className="absolute -bottom-1 h-[3px] bg-foreground transition-all duration-200" style={{ left: underlineStyle.left, width: underlineStyle.width }}/>
                    </div>
                </div>

            <div ref={ scrollContainer } onScroll={ handleScroll } className="text-[min(1rem,3vw)] py-3 px-5 overflow-y-auto">
                { activeTab === "registered" && (
                    <div className="flex justify-between">
                        <div className="flex flex-col tracking-wider leading-[2.4rem] text-foreground/70 font-medium">
                        { responses.registered?.map((player) => (
                            <div key={ player.id }>
                                { player.name }
                            </div>
                        ))}
                        </div>
                    
                        <div className="flex-none">
                            <StatusPill display={ responses.registered?.length + ` Players` }/>
                        </div>
                    </div>
                )}

                { activeTab === "not registered" && "notRegistered" in responses && (
                    <div className="flex justify-between">
                        <div className="flex flex-col text-base tracking-wider leading-[2.4rem] text-foreground/70 font-medium">
                        { responses.notRegistered?.map((player) => (
                            <div key={ player.id }>
                                { player.name }
                            </div>
                        ))}
                        </div>
                    
                        <div className="flex-none">
                            <StatusPill display={ responses.notRegistered?.length + ` Players` }/>
                        </div>
                    </div>
                )}

                { activeTab === "no response" && "noResponse" in responses && (
                    <div className="flex justify-between">
                        <div className="flex flex-col text-base tracking-wider leading-[2.4rem] text-foreground/70 font-medium">
                        { responses.noResponse?.map((player) => (
                            <div key={ player.id }>
                                { player.name }
                            </div>
                        ))}
                        </div>
                    
                        <div className="flex-none">
                            <StatusPill display={ responses.noResponse?.length + ` Players` }/>
                        </div>
                    </div>
                )}
            </div>

            <div className={`pointer-events-none absolute w-full bottom-0 h-13 bg-gradient-to-t from-card to-transparent transition-opacity duration-200 ${ showFade ? "opacity-100" : "opacity-0"}`}/>

        </div>
    )
};