import { PracticeCard, PracticeProps } from "@/components/PracticeCard";
import { TournamentCard, TournamentProps } from "@/components/TournamentCard";
import { GenericEventCard, EventProps } from "@/components/GenericEventCard";
import EventSuspense from "@/components/EventSuspense";


export type Event = | PracticeProps | TournamentProps| EventProps;

type EventContainerProps = {
    eventList: Event[] | null; // remove the | null once we use suspense
    skeletonCount: number;
};

export function EventContainer({ eventList, skeletonCount }: EventContainerProps) {

    if (eventList === null) {
        return <EventSuspense count={ skeletonCount }/>
    };
                
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 p-1 gap-4 justify-between rounded-[5px]">

                {eventList.map((event) => {
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
