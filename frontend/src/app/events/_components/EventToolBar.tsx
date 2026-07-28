import SearchBar from "@/components/SearchBar";
import StatusPill from "@/components/StatusPill";
import UpcomingPast from "./UpcomingPast";
import EventFilter from "./EventFilter";

type ToolBarProps = {
    upcoming: boolean;
    setUpcoming: (upcoming: boolean) => void;

    activeFilter: string;
    setActiveFilter: (filter: string) => void;
};

export default function EventToolBar({ upcoming, setUpcoming, activeFilter, setActiveFilter }: ToolBarProps) {

    // fetch status info
    const numEvents = "7 Events";

    return (
        <div className="py-3 overflow-visible flex gap-x-5 flex flex-col flex-wrap">
            <div>
                <UpcomingPast upcoming={ upcoming } setUpcoming={ setUpcoming }/>
            </div>

            <div className="flex flex-wrap gap-3 mt-5 items-end justify-between">
                <EventFilter activeFilter={ activeFilter } setActiveFilter={ setActiveFilter }/>
                <StatusPill display={ numEvents }/>
            </div>
        </div>
    )
};