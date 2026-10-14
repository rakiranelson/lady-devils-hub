"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Announcement, AnnouncementProps} from "@/components/Announcement";
import useScrollFade from "@/hooks/useScrollFade";
import api from "@/lib/api";
import AnnouncementSuspense from "./AnnouncementSuspense";

export default function AnnouncementContainer() {
    const [announcements, setAnnouncements] = useState<AnnouncementProps[]>([]);
    const { scrollContainer, showFade, handleScroll } = useScrollFade<HTMLDivElement>();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchAnnouncements = async () => {
        setIsLoading(true);

        try {
            const response = await api.get("/announcements/");
            setAnnouncements(response.data);
            console.log(response.data)
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // initial load
    useEffect(() => {
        fetchAnnouncements();
    }, []);
        
    // refetch after the edit modal closes
    useEffect(() => {
        window.addEventListener("announcement-created", fetchAnnouncements); // will likely create new function to both fetch and display a confirmation message
        window.addEventListener("announcement-updated", fetchAnnouncements);

        return () => {
            window.removeEventListener("announcement-created", fetchAnnouncements);
            window.removeEventListener("announcement-updated", fetchAnnouncements);
        }
    }, []);

    if (isLoading) {
        return <AnnouncementSuspense count={3} />; 
    }

    const pinnedAnnouncements =
    announcements.filter(a => a.pinned);

    const regularAnnouncements =
    announcements.filter(a => !a.pinned);


    return (
        <div className="w-full justify-between rounded-[5px] border-muted-2 relative">
            <div className="border-b-2 border-b-muted-2/50 rounded-t-[5px] pl-3 sm:text-lg">
                Announcements
            </div>

            <div className="pt-1 h-22 overflow-y-auto" ref={scrollContainer} onScroll={handleScroll}>

                { announcements.length === 0 && (
                    <div className="pl-3">
                        There are no recent announcements.
                    </div>
                )}


                { pinnedAnnouncements.length > 0 && (
                    <div className="flex flex-col gap-1 mb-1">
                        {pinnedAnnouncements.map((announcement) => (
                            <Announcement key= { announcement.id} { ...announcement } onRefetch={fetchAnnouncements}/>
                        ))}
                    </div>
                )}

                { regularAnnouncements.length > 0 && (
                    <div className="flex flex-col gap-1">
                        {regularAnnouncements.map((announcement) => (
                            <Announcement key= { announcement.id} { ...announcement } onRefetch={fetchAnnouncements}/>
                        ))}
                    </div>
                )}
            </div>

            { showFade && (
                <div className="pointer-events-none absolute w-full bottom-0 h-15 bg-gradient-to-t from-background to-transparent"></div>
            )}

        </div>
    );
};

