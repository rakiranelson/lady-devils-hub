"use client";

import { useRouter } from "next/navigation";
import { PracticeDetails, ExtendedPracticeProps } from "@/components/PracticeCard";
import { TournamentDetails, ExtendedTournamentProps } from "@/components/TournamentCard";
import { EventDetails, ExtendedEventProps } from "@/components/GenericEventCard";


export default function FullEvent({ params }: { params: { eventId: string }}) {
    const router = useRouter();
    const close = () => router.back();

    // const event: ExtendedPracticeProps | ExtendedTournamentProps | ExtendedEventProps = {
    //     id: 1,
    //     category: "practice",
    //     eventName: "Practice 9/3",
    //     locationName: "East Duke Lawn",
    //     locationAddress: "1304 Campus Dr Durham, NC 27708-8872",
    //     dateLabel: "Thursday, September\u00A03",
    //     time: "5:00-7:00pm",
    //     practiceType: "Regular",
    //     response: "yes",

    //     details: "Please bring cleats and/or gloves if you have them.",
    // };

    // const event: ExtendedPracticeProps | ExtendedTournamentProps | ExtendedEventProps = {
    //     id: 2,
    //     category: "tournament",
    //     eventName: "NIRSA Championship Tournament",
    //     locationName: "The Park - Turf Field 4",
    //     locationAddress: "600 Massie Rd Charlottesville, VA 22903",
    //     dateLabel: "Saturday, September\u00A05 - ",
    //     time: "All Day",
    //     tournamentType: "Mid-Atlantic Regional",
    //     response: "no",
    //     isRegistered: false,
    //     registrationDeadline: "9/1 @ 12:00pm",
    //     deadlinePassed: false,

    //     details: "Tournament Info \n-Game 1: UNC @ 9:00 AM (Field 3) \n-Game 2: UVA @ 11:00 AM (Field 2) \n-Game 3: Duke @ 2:00 PM (Field 1) \n\nHotel \n-Hilton Garden Inn \n-Check-in after 4 PM \n\n\n **Idk this is just an example of long text to see if it stretches the div horizontally. I am basically a certified yapper here!!",
    // };

    const event: ExtendedPracticeProps | ExtendedTournamentProps | ExtendedEventProps = {
        id: 3,
        category: "other",
        eventName: "Wine Night",
        locationName: "Blue Light Apt 407",
        locationAddress: "1605 Erwin Rd, Durham, NC 27705",
        dateLabel: "Thursday, September\u00A011",
        time: "5:00-7:00pm",
        response: null,
        details: "Please games, drinks, and a positive attitude!",
    };

    return (
    <div className="absolute inset-0 bg-black/60 z-100 flex" onClick={close}>
        <div className="flex flex-1 min-w-0 h-full items-center justify-center py-15 px-8 
        z-110" >
            <div className="contents" onClick={(e) => e.stopPropagation()}>
                { event.category === "practice" && 
                    <PracticeDetails { ...event }/> 
                }
    
                { event.category === "tournament" && 
                    <TournamentDetails { ...event }/>  
                }
    
                { (event.category !== "practice" && event.category !== "tournament") &&
                    <EventDetails { ...event }/>  
                }
            </div>
        </div>
    </div>
)
};