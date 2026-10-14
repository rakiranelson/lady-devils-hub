"use client";

import { useState, useRef, useEffect, RefObject } from "react";
import { useRouter } from "next/navigation";
import useScrollFade from "@/hooks/useScrollFade";
import EllipsisIcon from "@/assets/icons/ellipsis.svg";

import api from "@/lib/api";

type Option = {
    value: string;
    action: () => void;
};

type EllipsisProps = {
    announcementId: number;
    pinned: boolean;
    announcementRef: RefObject<HTMLDivElement | null>;
    onRefetch: () => void;
};

export default function AnnouncementEllipsis({ announcementId, pinned, announcementRef, onRefetch }: EllipsisProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollContainer, showFade, handleScroll } = useScrollFade<HTMLDivElement>( [isOpen] );

    // close when clicking anything outside this component
    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);

    // close when hover over anything that is not the announcement
    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideHover = (e: MouseEvent) => {
            if (announcementRef.current && !announcementRef.current.contains(e.target as Node)){
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

    const handleEdit = () => {
        router.push(`/announcements/${announcementId}/edit`)
    };

    const togglePin = async () => {
        const newPinned = !pinned

        try {
            await api.patch(`/announcements/${announcementId}/pin`, {"pinned": newPinned});
            onRefetch()

        } catch (err) {
            console.error(err);
        }
    };

    const handleRemove = async () => {
        try {
            await api.patch(`/announcements/${announcementId}/remove`);
            onRefetch()

        } catch (err) {
            console.error(err);
        }
    };

    const options: Option[] = pinned
    ? [{ value: "Unpin", action: togglePin }]
    : [{ value: "Pin", action: togglePin }];

    options.push({ value: "Edit", action: handleEdit });
    options.push({ value: "Remove", action: handleRemove });


    return (
        <div ref={containerRef}>
            <div onClick={() => setIsOpen((prev) => !prev)} className="flex flex-none items-center select-none hover:cursor-pointer hover:bg-muted-1/40 rounded-[5px]">
                <EllipsisIcon className={` text-foreground text-[1.5rem] `}/>
            </div>

            
            { isOpen && (
                <div className={` bg-muted-1/20 outline-1 outline-muted-1 rounded-[5px] absolute w-20 top-[25px] right-[28px] mt-2 select-none overflow-hidden z-100`}>
                    <div ref={ scrollContainer } onScroll={ handleScroll } className="max-h-50 overflow-y-auto scrollbar-thin">
                        { options.map((opt) => (
                            <div 
                                key={ opt.value } onClick={opt.action}
                                className={` flex items-center justify-center gap-3 px-4 py-2 cursor-pointer hover:bg-muted-1/50 `}>
                                    <span>{ opt.value }</span>       
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        
    )
};