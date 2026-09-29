
import ToolCard from "./ToolCard";

import CalendarIcon from "@/assets/icons/calendar.svg";
import AnnouncementIcon from "@/assets/icons/announcement.svg";
import PollIcon from "@/assets/icons/poll.svg";
import LoopIcon from "@/assets/icons/loop.svg";

export default function ManagementContainer() {
    return (
        <div>
            <div className="flex items-center gap-3">
                
                <span className="text-2xl font-semibold">Team Management</span>
            </div>

            <div className="grid grid-cols-4 gap-x-4 gap-y-3 px-1 mt-2">
                <ToolCard 
                    icon={ <CalendarIcon className="text-foreground text-[2.25rem]" strokeWidth={1.5}/>}
                    name="Event"
                    description="Create and schedule practices, tournaments, solo games, and other club events."
                    management={true}
                    actionHref="/executive-tools/create-event"
                />
                <ToolCard 
                    icon={ <AnnouncementIcon className="text-foreground text-[2.25rem]" strokeWidth={13}/>}
                    name="Announcement"
                    description="Create and post important updates, reminders, and information."
                    management={true}
                    actionHref="/"
                />
                <ToolCard 
                    icon={ <PollIcon className="text-foreground text-[2.25rem]" strokeWidth={4}/>}
                    name="Poll"
                    description="Collect team input to help determine event details and other decisions."
                    management={true}
                    actionHref="/"
                />
                <ToolCard 
                    icon={ <LoopIcon className="text-foreground text-[2.25rem]" strokeWidth={4}/>}
                    name="Practice Generator"
                    description="Quickly create events for recurring practices for the season."
                    management={true}
                    actionHref="/"
                />

            </div>
        </div>
    )
};