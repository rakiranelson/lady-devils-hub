import PinIcon from "@/assets/icons/pin.svg";

export type AnnouncementProps = {
    id: number;
    content: string;
    expiresAt: string;
    createdBy: string;
    pinned: boolean;
    createdTime: string;
};


export function Announcement(announcement : AnnouncementProps) {
    return (
        <div className={` w-full flex rounded-[5px] ${ announcement.pinned ? "" : ""} `}>

            <div className="w-6 flex shrink-0 justify-center pt-[2px] items-center">
                { announcement.pinned && (
                    <PinIcon className="mb-1 text-primary"/>
                )}

            </div>
            <div className="w-22 shrink-0 whitespace-nowrap flex justify-end text-muted-2/70 sm:text-base">
                { announcement.createdTime }
            </div>
            <div className={` ml-4 sm:text-base ${ announcement.pinned ? "font-semibold" : "text-foreground/85"} `}>
                { announcement.content }
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
