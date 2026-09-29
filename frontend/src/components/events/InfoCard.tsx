
type CardProps = {
    icon: React.ReactNode,
    label?: string,
    details?: string;
};

export default function InfoCard({ icon, label, details }: CardProps) {
    return (
        <div className="bg-muted-1/30 border-1 border-muted-1/45 rounded-[5px] shadow-small-card flex py-2 sm:py-[10px] px-3 gap-5 text-[min(1rem,2.5vw)] items-center cursor-default">
            { icon }
            
            <div className="flex flex-col font-medium leading-tight">
                <div className="text-foreground text-right">{ label }</div>
                <div className="text-foreground/50 text-right select-all">{ details }</div>
            </div>
        </div>
    )
};