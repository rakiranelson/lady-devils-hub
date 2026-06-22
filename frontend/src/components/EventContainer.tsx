import { PracticeCard, PracticeProps } from "@/components/PracticeCard";
import { TournamentCard, TournamentProps } from "@/components/TournamentCard";
import { GenericEventCard, EventProps } from "@/components/GenericEventCard";


export type Event = | PracticeProps | TournamentProps| EventProps;

type EventContainerProps = {
    eventList: Event[];
};

export default function EventContainer({ eventList }: EventContainerProps) {

    return (
        <div className="grid grid-cols-3  gap-4 justify-between rounded-[5px]">

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
