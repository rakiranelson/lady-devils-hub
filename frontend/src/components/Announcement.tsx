import PinIcon from "@/assets/icons/pin.svg";
import AnnouncementEllipsis from "./AnnouncementEllipsis";
import { useRef, useContext } from "react";
import { UserContext } from "@/contexts/CurrentUserContext";

export type AnnouncementProps = {
    id: number;
    content: string;
    pinned: boolean;
    createdTime: string;
};


export function Announcement(announcement : AnnouncementProps & { onRefetch: () => void }) {
    const isExec = useContext(UserContext)?.exec;
    const announcementRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={announcementRef} className={` w-full flex rounded-[5px] group `}>

            <div className="w-6 flex shrink-0 justify-center pt-[2px] items-center">
                { announcement.pinned && (
                    <PinIcon className="mb-1 text-primary animate-shake"/>
                )}

            </div>
            <div className="w-25 shrink-0 whitespace-nowrap flex justify-end text-muted-2/70 sm:text-base">
                { announcement.createdTime }
            </div>
            <div className={` ml-4 sm:text-base ${ announcement.pinned ? "font-semibold" : "text-foreground/85"} `}>
                { announcement.content }
            </div>
            <div className="ml-auto opacity-10 group-hover:opacity-100 text-sm">
                { isExec && (
                    <AnnouncementEllipsis 
                        announcementId={announcement.id}
                        pinned={announcement.pinned}
                        announcementRef={announcementRef}
                        onRefetch={announcement.onRefetch}
                    />
                )}    
            </div>

        </div>
    );
};

export function AnnouncementDetails(announcement : AnnouncementProps) {
    return (
        <div className="h-18 w-full flex gap-2">
            <div>
                { announcement.createdTime }
            </div>
            <div>
                { announcement.content }
            </div>

        </div>
    );
};
