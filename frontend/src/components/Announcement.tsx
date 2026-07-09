import ProfileIcon from "@/components/ProfileIcon";

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
        <div className={` w-full flex text-sm rounded-[5px] ${ announcement.pinned ? "bg-navigation" : ""} `}>

            <div className="w-6 flex shrink-0 justify-center pt-[2px]">
                { announcement.pinned && (
                    <ProfileIcon initials="" size={ 14 }></ProfileIcon>
                )}

            </div>
            <div className="w-22 shrink-0 whitespace-nowrap flex justify-end text-muted-2/70 sm:text-base">
                { announcement.createdTime }
            </div>
            <div className="ml-4 sm:text-base">
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
