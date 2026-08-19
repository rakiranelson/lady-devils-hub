"use client";

import useScrollFade from "@/hooks/useScrollFade";

type ContainerProps = {
    content: string;
};

export default function DetailsContainer({ content }: ContainerProps) {
    const { scrollContainer, showFade, handleScroll } = useScrollFade<HTMLDivElement>();

    return (
        <div className="h-full border-muted-1/45 rounded-[5px] shadow-small-card p-3 relative">
            <div className="font-semibold text-[min(1.1rem,2.7vw)] mb-2">Details:</div>
            
            <div ref={ scrollContainer } onScroll={ handleScroll } className="h-full overflow-y-auto">
                <div className="text-[min(1rem,2.5vw)]">{ content }</div>
            </div> 

            <div className={`pointer-events-none absolute w-full bottom-0 h-15 bg-gradient-to-t from-card to-transparent transition-opacity duration-200 ${ showFade ? "opacity-100" : "opacity-0"}`}/>
        </div>
    )
};