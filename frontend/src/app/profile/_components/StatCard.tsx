
export type StatCardProps = {
    heading: string;
    value: number;
};

export function StatCard({ heading, value }: StatCardProps) {
    return (
        <div className="group rounded-[10px] border-2 border-muted-1/75 w-28 h-33 -mb-2">
            <div className="flex justify-center text-lg font-medium pt-2">{ heading }</div>
            <div className="flex justify-center text-[3rem] mt-1">{ value }</div>
        </div>
    )
};