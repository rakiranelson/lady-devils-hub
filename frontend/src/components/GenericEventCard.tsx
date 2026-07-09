import Button from "@/components/Button"
import MoreDetails from "@/components/MoreDetails";
import Image from "next/image";

export type EventProps = {
    id: number;
    eventName: string;
    locationName: string;
    category: string;
    date: string | null;
    time: string | null;
    response: string | null;
};


export function GenericEventCard(event : EventProps) {
    return (
        <div className="max-w-[260px] md:max-w-[304px] aspect-[304/259]  flex flex-col text-sm bg-card rounded-[18px]">
        
                    <div className="w-full h-2/9 rounded-t-[18px] overflow-hidden relative">

                        { event.category === "game" && (
                            <Image
                                            className="object-cover object-[30%_70%] opacity-40"
                                            src="/solo-game.png"
                                            alt="Game Banner"
                                            fill={ true }
                                            priority
                                        />
                        )}

                        { event.category != "game" && (
                            <Image
                                            className="object-cover object-[30%_30%] opacity-40"
                                            src="/community.jpg"
                                            alt="Community Banner"
                                            fill={ true }
                                            priority
                                        />
                        )}
                        
                        
                    </div>

            <div className="px-3 pt-2">
                <div>
                    <div className="text-[min(1.3rem,3.5vw)] font-semibold truncate" title="">
                        { event.eventName }
                    </div>

                    <div className="text-metadata text-[min(0.875rem,2.5vw)] -mt-1 truncate">
                        <span className="invisible">Placeholder</span>
                    </div>

                    <div className="text-[min(1rem,3vw)] mt-2 truncate">
                        { event.date }
                    </div>

                    <div className="text-[min(1rem,3vw)] truncate">
                        { event.time }
                    </div>

                    <div className="text-[min(1rem,3vw)] truncate">
                        { event.locationName }
                    </div>

                    <div className="flex flex-wrap justify-between mt-4 sm:mt-7 pb-4 text-[min(0.875rem,2.25vw)]">
                        <Button title="button"></Button>

                        <div className="pt-1.5 items-center h-[28px]">
                            <MoreDetails title="More Details" color="muted-2"></MoreDetails>
                        </div>
                    </div>

                </div>
            </div>


        </div>
    );
};

export function PracticeDetails(event : EventProps) {
    return (
        <div className="w-full flex gap-2">


        </div>
    );
};
