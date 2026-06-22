import Button from "@/components/Button"
import MoreDetails from "@/components/MoreDetails";

export type PracticeProps = {
    id: number;
    category: string;
    eventName: string;
    locationName: string;
    date: string | null;
    time: string | null;
    practiceType: string;
    response: string | null;

};


export function PracticeCard(practice : PracticeProps) {  
    return (
        <div className="max-w-[260px] md:max-w-[304px] aspect-[304/259]  flex flex-col text-sm bg-card rounded-[18px]">

            <div className="bg-muted-1 w-full h-2/9 rounded-t-[18px]">
                
            </div>

            <div className="px-3 pt-2">
                <div>
                   <p className="text-[min(1.3rem,3vw)] font-semibold truncated">
                        { practice.eventName }
                    </p>

                    <p className="text-metadata text-[min(0.875rem,2vw)] -mt-1 truncated">
                        { practice.practiceType }
                    </p>

                    <div className="text-[min(1rem,2.5vw)] mt-2 truncated">
                        { practice.date }
                    </div>

                    <div className="text-[min(1rem,2.5vw)] truncated">
                        { practice.time }
                    </div>

                    <div className="text-[min(1rem,2.5vw)] truncated">
                        { practice.locationName }
                    </div>

                    <div className="flex flex-wrap justify-between mt-7 pb-4 text-[min(0.875rem,2.25vw)]">
                        <Button title="RSVP Now"></Button>

                        <div className="pt-1.5 items-center h-[28px]">
                            <MoreDetails title="More Details" color="muted-2"></MoreDetails>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export function PracticeDetails(practice : PracticeProps) {
    return (
        <div className="w-full flex gap-2">


        </div>
    );
};
