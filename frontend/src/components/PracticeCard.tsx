import Button from "@/components/Button"
import MoreDetails from "@/components/MoreDetails";
import Image from "next/image";

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

            <div className="w-full h-2/9 rounded-t-[18px] overflow-hidden relative">
                <Image
                                    className="object-cover object-[30%_70%] opacity-40"
                                    src="/practices.png"
                                    alt="Practice Banner"
                                    fill={ true }
                                    priority
                                />
                
            </div>

                <div className="px-3 pt-2">
                    <div>
                    <div className="text-[min(1.3rem,3vw)] font-semibold truncate" title="">
                            { practice.eventName }
                        </div>

                        <div className="text-metadata text-[min(0.875rem,2vw)] -mt-1 truncate">
                            { practice.practiceType }
                        </div>

                        <div className="text-[min(1rem,2.5vw)] mt-2 truncate">
                            { practice.date }
                        </div>

                        <div className="text-[min(1rem,2.5vw)] truncate">
                            { practice.time }
                        </div>

                        <div className="text-[min(1rem,2.5vw)] truncate">
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
