import EditIcon from "@/assets/icons/edit.svg";

export type InfoCardProps = {
    children: React.ReactNode;
    heading: string;
    canEdit?: boolean;
    className?: string;
};

export function InfoCard({ children, heading = "info", canEdit = false, className }: InfoCardProps) {
    return (
        <div className={`group rounded-[3px] p-5 pt-4 ${ className }`}>
            <div className="flex">
                <span className="font-semibold text-xl">{ heading }</span>
                <EditIcon className={` ${ canEdit ? "text-[1.4rem] hidden ml-auto group-hover:block group-hover:text-foreground/50 hover:text-foreground hover:cursor-pointer" : "hidden"} `}/>
            </div>
            <div className="pt-4 pb-2 px-5">{ children }</div>
        </div>
    )
};