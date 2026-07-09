
import { Announcement, AnnouncementProps, AnnouncementDetails} from "@/components/Announcement";

type AnnouncementContainerProps = {
    announcementList: AnnouncementProps[];
};

export default function AnnouncementContainer({ announcementList }: AnnouncementContainerProps) {

    const pinnedAnnouncements =
    announcementList.filter(a => a.pinned);

    const regularAnnouncements =
    announcementList.filter(a => !a.pinned);


    return (
        <div className="w-full justify-between rounded-[5px] border-muted-2">
            <div className="border-b-2 border-b-muted-2/50 rounded-t-[5px] pl-3 sm:text-lg">
                Announcements
            </div>

            <div className="pt-1 h-22 overflow-y-auto">

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

        </div>
    );
};