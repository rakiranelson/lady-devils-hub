import ContinueArrowIcon from "@/assets/icons/continueArrow.svg";
import Link from "next/link";

type CardProps = {
    icon: React.ReactNode,
    name: string,
    description: string;
    management?: boolean;
    analytics?: boolean;
    actionHref: string;
    disabled?: boolean;
};

export default function ToolCard({ icon, name, description, management = false, analytics = false, actionHref, disabled = false }: CardProps) {
    return (
        <div className={`relative h-[250px] rounded-[5px] overflow-hidden flex flex-col bg-card shadow-small-card select-none group outline-3 outline-transparent transition-all ${ disabled ? "" : "hover:outline-primary" }`}>
            <div className="flex flex-col flex-1">
                <div className="flex-[1] flex items-end justify-center mt-3">
                    {icon}
                </div>
                <div className="text-2xl font-medium flex justify-center items-end text-center leading-tight p-2 px-3 flex-[1]">{ name }</div>
                <div className="text-foreground/75 text-sm text-center px-1 p-2 px-5 flex-[2] select-text">{ description }</div>
            </div>
            
            
           <Link href={ actionHref } className={`bg-primary-light/20 p-[6px] text-xl font-regular mt-auto flex items-center justify-center gap-3 transition-all group/button ${ disabled ? "" : "hover:cursor-pointer group-hover:bg-primary" }`}>

                { management && (
                    <span>Open</span>
                )}

                { analytics && (
                    <span>View</span>
                )}
                
                <ContinueArrowIcon className="text-foreground text-[0.875rem] group-hover/button:translate-x-2 transition-transform"/>
                    
            </Link>

            { disabled && (
                <div className="absolute inset-0 bg-background/60"/>
            )}
        </div>
    )
};