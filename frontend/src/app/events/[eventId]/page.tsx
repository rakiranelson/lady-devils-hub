import { PracticeDetails, ExtendedPracticeProps } from "@/components/PracticeCard";
import { TournamentDetails, ExtendedTournamentProps } from "@/components/TournamentCard";
import { GenericEventCard, ExtendedEventProps } from "@/components/GenericEventCard";


export default function FullEvent({ params }: { params: { eventId: string } }) {
    // fetch using params.eventId
    const event: ExtendedPracticeProps | ExtendedTournamentProps | ExtendedEventProps = {
        id: 1,
        category: "practice",
        eventName: "Practice 9/3",
        locationName: "East Duke Lawn",
        locationAddress: "1304 Campus Dr Durham, NC 27708-8872",
        dateLabel: "Thursday, September\u00A03",
        time: "5:00-7:00pm",
        practiceType: "Regular",
        response: "yes",

        details: "Please bring cleats and/or gloves if you have them.",
    };

    return (
        <div className="flex h-full contents">
            <div className="flex flex-1 min-w-0 h-full items-center py-12 px-8">
            { event.category === "practice" && 
            <PracticeDetails { ...event }/>
        }
        </div>
        </div>
        
    )
};