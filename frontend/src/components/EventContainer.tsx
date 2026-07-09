import { PracticeCard, PracticeProps } from "@/components/PracticeCard";
import { TournamentCard, TournamentProps } from "@/components/TournamentCard";
import { GenericEventCard, EventProps } from "@/components/GenericEventCard";
import useMediaQuery from "@/hooks/useMediaQuery"


export type Event = | PracticeProps | TournamentProps| EventProps;

type EventContainerProps = {
    eventList: Event[];
};

export default function EventContainer({ eventList }: EventContainerProps) {

    const isThreeColumns = useMediaQuery("(min-width: 640px)");

    if (isThreeColumns === null) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="aspect-[304/259] rounded-[18px] bg-card animate-pulse" />
                <div className="aspect-[304/259] rounded-[18px] bg-card animate-pulse" />
                <div className="aspect-[304/259] rounded-[18px] bg-card animate-pulse" />
            </div>
        );
    };

    const visibleEvents = isThreeColumns
        ? eventList.slice(0, 3)
        : eventList.slice(0, 4);
                
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3  gap-4 justify-between rounded-[5px]">

                {visibleEvents.map((event) => {
                    if (event.category === "practice") {
                        return <PracticeCard key={ event.id } { ...event } />;
                    }

                    if (event.category === "tournament") {
                        return <TournamentCard key={ event.id } { ...event } />;
                    }

                    return <GenericEventCard key={ event.id } { ...event } />
                })}
                    
        </div>
    );
};
