"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useScrollFade from "@/hooks/useScrollFade";
import EllipsisIcon from "@/assets/icons/ellipsis.svg";
import api from "@/lib/api";

type Props = {
    fullEvent?: boolean;
    eventId: number;
    onRefetch: () => void;
};

type Option = {
    value: string;
    action: () => void;
};

export default function EventEllipsis({ fullEvent = false, eventId, onRefetch }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollContainer, showFade, handleScroll } = useScrollFade<HTMLDivElement>( [isOpen] );

    // close when hovering anything outside this component
    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideHover = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mouseover", handleOutsideHover);
        return () => document.removeEventListener("mouseover", handleOutsideHover);
    }, [isOpen]);

    // close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    const handleCancel = async () => {
        try {
            await api.patch(`/events/${eventId}/cancel`)
            onRefetch()
        } catch (err) {
            console.log(err)
        }
    };

    const handleEdit = () => {
        router.push(`/events/${eventId}/edit`)
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/events/${eventId}`)
            onRefetch()
        } catch (err) {
            console.log(err)
        }
    };

    const options: Option[] = [
        {value: "Edit", action: handleEdit},
        {value: "Cancel", action: handleCancel},
        {value: "Delete", action: handleDelete},
    ];


    return (
        <div ref={containerRef}>
            <div onClick={() => setIsOpen((prev) => !prev)} className="mt-2 mr-2 flex flex-none items-center select-none hover:cursor-pointer hover:bg-background/40 rounded-[5px]">
                <EllipsisIcon className={` text-foreground ${ fullEvent ? "text-[2rem]" : "text-[1.5rem]"} `}/>
            </div>

            
            { isOpen && (
                <div className={` ${ fullEvent ? "bg-background" : "bg-background/80" } outline-1 outline-muted-2/70 rounded-[5px] absolute w-20 top-5 left-[-30px] mt-2 select-none overflow-hidden z-100 `}>
                    <div ref={ scrollContainer } onScroll={ handleScroll } className="max-h-50 overflow-y-auto scrollbar-thin">
                        { options.map((opt) => (
                            <div 
                                key={ opt.value } onClick={opt.action}
                                className={` flex items-center justify-center gap-3 px-4 py-2 cursor-pointer hover:bg-muted-1/70 `}>
                                    <span>{ opt.value }</span>       
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        
    )
};
