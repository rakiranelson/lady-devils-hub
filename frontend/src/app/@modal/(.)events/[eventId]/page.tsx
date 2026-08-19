"use client";

import { useRouter } from "next/navigation";
import { PracticeDetails, ExtendedPracticeProps } from "@/components/PracticeCard";
import { TournamentDetails, ExtendedTournamentProps } from "@/components/TournamentCard";
import { GenericEventCard, ExtendedEventProps } from "@/components/GenericEventCard";


export default function FullEvent({ params }: { params: { eventId: string }}) {
    const router = useRouter();
    const close = () => router.back();

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

    // return (
    //     <div className="absolute inset-0 bg-black/60 z-100" onClick={close}>
    //         <div className="flex h-full items-center justify-center py-15 px-8 z-110" >
    //             { event.category === "practice" && 
    //             <div className="animate-grow" onClick={(e) => e.stopPropagation()}>
    //             <PracticeDetails { ...event }/>
    //             </div> 
                
    //         }
    //         </div>
    //     </div>
    // )
    return (
    <div className="absolute inset-0 bg-black/60 z-100 flex" onClick={close}>
        <div className="flex flex-1 min-w-0 h-full items-center justify-center py-15 px-8 
        z-110" >
            { event.category === "practice" && 
            <div className="contents" onClick={(e) => e.stopPropagation()}>
            <PracticeDetails { ...event }/>
            </div> 
            
        }
        </div>
    </div>
)
};