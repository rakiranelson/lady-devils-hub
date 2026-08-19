
import CircleIcon from "@/assets/icons/circle.svg";

type StatusPillProps = {
    response: string;
    hiddenEdit?: boolean;
}
export function RSVPChip({ response, hiddenEdit = false }: StatusPillProps) {
    return (
        <div className="flex gap-2 items-center select-none">
            { response === "yes" && (
                <div className="bg-[hsl(135,59%,20%)]/80 h-full rounded-[30px] flex flex-none items-center">
                    <CircleIcon className="text-success text-[.6rem] mb-[1px] ml-3 mr-2"/>
                    <span className="text-foreground mr-4">Going</span>
                </div>
            )}

            { response === "maybe" && (
                <div className="bg-[hsl(48,100%,20%)]/80 h-full rounded-[30px] flex flex-none items-center">
                    <CircleIcon className="text-warning text-[.6rem] mb-[1px] ml-3 mr-2"/>
                    <span className="text-foreground mr-4">Maybe Going</span>
                </div>
            )}

            { response === "no" && (
                <div className="bg-[hsl(359,100%,25%)]/60 h-full rounded-[30px] flex flex-none items-center">
                    <CircleIcon className="text-alert text-[.6rem] mb-[1px] ml-3 mr-2"/>
                    <span className="text-foreground mr-4">Not Going</span>
                </div>
            )}

            <div className={`text-muted-1 underline decoration-1 hover:text-foreground hover:cursor-pointer ${ hiddenEdit ? "hidden" : "block" } `}>
                Edit
            </div>
        </div>
    )
};