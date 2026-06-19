
export type TournamentProps = {
    id: number;
    category: string;
    eventName: string;
    locationName: string;
    date: string | null;
    time: string | null;
    practiceType: string;
    attending: string;

};


export function PracticeCard(practice : PracticeProps) {
    return (
        <div className="w-48 h-48 flex text-sm bg-yellow-500 rounded-[5px]">


        </div>
    );
};

export function PracticeDetails(practice : PracticeProps) {
    return (
        <div className="w-full flex gap-2">


        </div>
    );
};
