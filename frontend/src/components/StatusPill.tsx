
import AlertIcon from "@/assets/icons/alert.svg";

type StatusPillProps = {
    display: string;
}
export default function StatusPill({ display }: StatusPillProps) {
    return (
        <div className="bg-card h-7 mt-2 rounded-[30px] flex flex-none items-center md:ml-auto select-none">
            <AlertIcon className="text-transparent w-3 ml-3 mr-2"/>
            <span className="text-foreground mr-4">{ display }</span>
        </div>
    )
};