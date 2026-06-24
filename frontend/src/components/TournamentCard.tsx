import Button from "@/components/Button"
import MoreDetails from "@/components/MoreDetails";
import Image from "next/image";

export type TournamentProps = {
    id: number;
    category: string;
    eventName: string;
    locationName: string;
    date: string | null;
    time: string | null;
    tournamentType: string;
    response: string | null;
    registered: boolean;
    registrationDeadline: string;
    deadline_passed: boolean

};


export function TournamentCard(tournament : TournamentProps) {
    return (
        <div className="max-w-[260px] md:max-w-[304px] aspect-[304/259]  flex flex-col text-sm bg-card rounded-[18px]">
        
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
                   <div className="text-[min(1.3rem,3vw)] font-semibold truncate">
                        { tournament.eventName }
                    </div>

                    <div className="text-metadata text-[min(0.875rem,2vw)] -mt-1 truncate">
                        { tournament.tournamentType }
                    </div>

                    <div className="text-[min(1rem,2.5vw)] mt-2 truncate">
                        { tournament.date }
                    </div>

                    <div className="text-[min(1rem,2.5vw)] truncate">
                        { tournament.locationName }
                    </div>

                    <div className={`text-[min(1rem,2.5vw)] truncate ${ !tournament.deadline_passed ? "text-warning" : "" }`}>
                        Register by { tournament.registrationDeadline }
                    </div>

                    <div className="flex flex-wrap justify-between mt-7 pb-4 text-[min(0.875rem,2.25vw)]">
                        <Button title="Register"></Button>

                        <div className="pt-1.5 items-center h-[28px]">
                            <MoreDetails title="More Details" color="muted-2"></MoreDetails>
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
