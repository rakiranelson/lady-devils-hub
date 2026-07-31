import Button from "@/components/Button"
import MoreDetails from "@/components/MoreDetails";
import Image from "next/image";

// icons
import CalendarIcon from "@/assets/icons/calendar.svg";
import LocationIcon from "@/assets/icons/location.svg";
import DeadlineIcon from "@/assets/icons/deadline.svg";

export type TournamentProps = {
    id: number;
    category: string;
    eventName: string;
    locationName?: string;
    dateLabel?: string | null;
    endDate: Date;
    time?: string | null;
    tournamentType?: string;
    response?: string | null;
    registered?: boolean;
    registrationDeadline?: string;
    deadline_passed?: boolean

};


export function TournamentCard(tournament : TournamentProps) {
    return (
        <div className="max-w-[260px] md:max-w-[304px] aspect-[304/259]  flex flex-col text-sm bg-card rounded-[18px] hover:scale-102 transition-transform duration-200">
        
                    <div className="w-full h-2/9 rounded-t-[18px] overflow-hidden relative">
                        <Image
                            className="object-cover object-[50%_40%] opacity-40"
                            src="/tournaments.jpg"
                            alt="Tournament Banner"
                            fill={ true }
                            priority
                        />
                        
                    </div>
        

            <div className="px-3 pt-2">
                <div>
                   <div className="text-[min(1.3rem,3.5vw)] font-semibold truncate">
                        { tournament.eventName }
                    </div>

                    <div className="text-metadata text-[min(0.875rem,2.5vw)] -mt-1 truncate">
                        { tournament.tournamentType }
                    </div>

                    <div className="text-[min(1rem,3vw)] mt-2 flex items-center gap-2">
                        <CalendarIcon className="overflow-visible"/>
                        <span className="truncate">{ tournament.dateLabel }</span>
                    </div>

                    <div className="text-[min(1rem,3vw)] truncate flex items-center gap-2">
                        <LocationIcon className="overflow-visible"/>
                        <span className="truncate">{ tournament.locationName }</span>
                    </div>

                    <div className={`text-[min(1rem,3vw)] overflow-visible flex items-center gap-2 ${ !tournament.deadline_passed ? "text-warning" : "" }`}>
                        <DeadlineIcon className={`overflow-visible ${ !tournament.deadline_passed ? "text-warning animate-shake-repeat" : "" } `}/>
                        <span className="truncate">Register by { tournament.registrationDeadline }</span>
                    </div>

                    <div className="flex flex-wrap justify-between mt-4 sm:mt-7 pb-4 text-[min(0.875rem,2.5vw)]">
                        <Button title="Register"></Button>

                        <div className="flex items-center h-[28px]">
                            <MoreDetails title="More Details" href="/"  color="muted-2"></MoreDetails>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export function PracticeDetails(tournament : TournamentProps) {
    return (
        <div className="w-full flex gap-2">


        </div>
    );
};
