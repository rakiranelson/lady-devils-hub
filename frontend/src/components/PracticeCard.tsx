import Button from "@/components/Button"
import MoreDetails from "@/components/MoreDetails";
import Image from "next/image";

// icons
import CalendarIcon from "@/assets/icons/calendar.svg";
import TimeIcon from "@/assets/icons/time.svg";
import LocationIcon from "@/assets/icons/location.svg";

export type PracticeProps = {
    id?: number;
    category?: string;
    eventName?: string;
    locationName?: string;
    date?: string | null;
    time?: string | null;
    practiceType?: string;
    response?: string | null;

};


export function PracticeCard(practice : PracticeProps) {  
    return (
        <div className="max-w-[260px] md:max-w-[304px] aspect-[304/259]  flex flex-col text-sm bg-card rounded-[18px] hover:scale-102 transition-transform duration-200">

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
                    <div className="text-[min(1.3rem,3.5vw)] font-semibold truncate" title="">
                            { practice.eventName }
                        </div>

                        <div className="text-metadata text-[min(0.875rem,2.5vw)] -mt-1 truncate">
                            { practice.practiceType }
                        </div>

                        <div className="text-[min(1rem,3vw)] mt-2 flex items-center gap-2">
                            <CalendarIcon className="overflow-visible"/>
                            <span className="truncate">{ practice.date }</span>
                        </div>

                        <div className="text-[min(1rem,3vw)] flex items-center gap-2">
                            <TimeIcon className="overflow-visible"/>
                            <span className="truncate">{ practice.time }</span>
                        </div>

                        <div className="text-[min(1rem,3vw)] truncate flex items-center gap-2">
                            <LocationIcon className="overflow-visible"/>
                            <span className="truncate">{ practice.locationName }</span>
                        </div>

                        <div className="flex flex-wrap justify-between mt-4 sm:mt-7 pb-4 text-[min(0.875rem,2.5vw)]">
                            <Button title="RSVP Now"></Button>

                            <div className="flex items-center h-[28px]">
                                <MoreDetails title="More Details" href="/" color="muted-2"></MoreDetails>
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
