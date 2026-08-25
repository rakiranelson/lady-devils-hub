
import CircleIcon from "@/assets/icons/circle.svg";

type StatusPillProps = {
    response: string | null;
    isRegistered: boolean;
}
export default function RegistrationChip({ response, isRegistered }: StatusPillProps) {
    return (
        <div className="flex gap-2 items-center select-none">

            { (isRegistered === true) ? 
            
                (
                <div className="bg-[hsl(135,59%,20%)]/80 h-full rounded-[30px] flex flex-none items-center">
                    <CircleIcon className="text-success text-[.6rem] mb-[1px] ml-3 mr-2"/>
                    <span className="text-foreground mr-4">Registered</span>
                </div>
                ) :
                ( 
                    <>
                        { response === "no" && (
                            <div className="bg-[hsl(359,100%,25%)]/60 h-full rounded-[30px] flex flex-none items-center">
                                <CircleIcon className="text-alert text-[.6rem] mb-[1px] ml-3 mr-2"/>
                                <span className="text-foreground mr-4">Not Attending</span>
                            </div>
                        )}
                        { response === null && (
                            <div className="bg-[hsl(359,100%,25%)]/60 h-full rounded-[30px] flex flex-none items-center">
                                <CircleIcon className="text-alert text-[.6rem] mb-[1px] ml-3 mr-2"/>
                                <span className="text-foreground mr-4">Not Registered</span>
                            </div>
                        )}
                    </>
                )

            }

        </div>
    )
};