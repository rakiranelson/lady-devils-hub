
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
        <div className="max-w-[260px] md:max-w-[304px] aspect-[304/265]  flex flex-col text-sm bg-card rounded-[18px]">

            <div className="bg-muted-1 w-full h-2/9 rounded-t-[18px]">
                
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
