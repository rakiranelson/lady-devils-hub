import SearchBar from "@/components/SearchBar";
import { StatusPill, StatusPillSuspense } from "@/components/StatusPill";
import UpcomingPast from "./UpcomingPast";
import EventFilter from "./EventFilter";

type ToolBarProps = {
    past: boolean;
    setPast: (past: boolean) => void;

    activeFilter: string;
    setActiveFilter: (filter: string) => void;

    eventCount: number | null // null here until i incorporate suspense
};

export default function EventToolBar({ past, setPast, activeFilter, setActiveFilter, eventCount }: ToolBarProps) {

    return (
        <div className="py-3 overflow-visible flex gap-x-5 flex flex-col flex-wrap">
            <div>
                <UpcomingPast past={ past } setPast={ setPast }/>
            </div>

            <div className="flex flex-wrap gap-3 mt-5 items-end justify-between">
                <EventFilter activeFilter={ activeFilter } setActiveFilter={ setActiveFilter }/>

                { eventCount === null && <StatusPillSuspense/>}
                <StatusPill display={` ${ eventCount } Events`}/>
            </div>
        </div>
    )
};