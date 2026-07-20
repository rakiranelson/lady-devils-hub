"use client";

import { useState, useRef, useEffect } from "react";
import { Announcement, AnnouncementProps, AnnouncementDetails} from "@/components/Announcement";

type AnnouncementContainerProps = {
    announcementList: AnnouncementProps[];
};

export default function AnnouncementContainer({ announcementList }: AnnouncementContainerProps) {

    const pinnedAnnouncements =
    announcementList.filter(a => a.pinned);

    const regularAnnouncements =
    announcementList.filter(a => !a.pinned);

    const scrollContainer = useRef<HTMLDivElement>(null);
    const [showFade, setShowFade] = useState(false);

    const updateFade = () => {

        if (scrollContainer.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer.current;
            const buffer = 1

            setShowFade(scrollTop + clientHeight < scrollHeight - buffer);
        }
    };

    useEffect(() => {
        updateFade();

        const observer = new ResizeObserver(updateFade);

        if (scrollContainer.current) {
            observer.observe(scrollContainer.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleScroll = () => {
        updateFade();
    };


    return (
        <div className="w-full justify-between rounded-[5px] border-muted-2 relative">
            <div className="border-b-2 border-b-muted-2/50 rounded-t-[5px] pl-3 sm:text-lg">
                Announcements
            </div>

            <div className="pt-1 h-22 overflow-y-auto" ref={scrollContainer} onScroll={handleScroll}>

                { announcementList.length === 0 && (
                    <div className="pl-3">
                        There are no recent announcements.
                    </div>
                )}


                { pinnedAnnouncements.length > 0 && (
                    <div className="flex flex-col gap-1 mb-1">
                        {pinnedAnnouncements.map((announcement) => (
                            <Announcement key= { announcement.id} { ...announcement }></Announcement>
                        ))}
                    </div>
                )}

                { regularAnnouncements.length > 0 && (
                    <div className="flex flex-col gap-1">
                        {regularAnnouncements.map((announcement) => (
                            <Announcement key= { announcement.id} { ...announcement }></Announcement>
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