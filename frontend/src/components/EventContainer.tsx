import { PracticeCard, PracticeProps } from "./PracticeCard";

export type Event = {
    id: number;
    eventName: string;
    locationName: string;
    category: string;
    date: string | null;
    time: string | null;
};

type Event =
    | PracticeProps;
    | TournamentEvent;

type EventContainerProps = {
    announcementList: Event[];
};

export default function EventContainer({ eventList }: EventContainerProps) {

    // const pinnedAnnouncements =
    // announcementList.filter(a => a.pinned);

    // const regularAnnouncements =
    // announcementList.filter(a => !a.pinned);


    return (
        <div className="w-full justify-between rounded-[5px] bg-green-700 overflow-y-auto">

            <div className="pt-1">

                {eventList.map((event) => {

                    if (event.category === "practice") {
                        /* run a query to fetch practice specific data from practice table using id
                        - also need to check if they RSVP or not
                         */

                        const practiceType: string = "Regular";
                        const attending: boolean = true;

                        const practice = { ...event, practiceType: practiceType, attending: attending}

                        delete practice.category // we don't need to know the category anymore

                        return <PracticeCard { ...practice }></PracticeCard>
                    }
                    
                    
                    })}
                    
            </div>

        </div>
    );
};

// switch (event.category) {
//     case "practice":
//         return <PracticeCard {...event} />

//     case "competition":
//         return <CompetitionCard {...event} />
// }