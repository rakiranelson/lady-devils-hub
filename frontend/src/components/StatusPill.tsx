
import AlertIcon from "@/assets/icons/alert.svg";

type StatusPillProps = {
    display: string;
}
export function StatusPill({ display }: StatusPillProps) {
    return (
        <div className="bg-card h-7 mt-2 rounded-[30px] flex flex-none items-center md:ml-auto select-none">
            <AlertIcon className="text-transparent w-3 ml-3 mr-2"/>
            <span className="text-foreground mr-4">{ display }</span>
        </div>
    )
};

export function StatusPillSuspense() {
    return (
        <div className="animate-pulse bg-muted-1 rounded-full h-7 w-30" />
    )
};