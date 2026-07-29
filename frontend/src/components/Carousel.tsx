"use client";
import { useRef, useState } from "react";
import { PlayProps, PlayCard } from "@/components/PlayCard";
import LeftArrowIcon from "@/assets/icons/leftArrow.svg";
import RightArrowIcon from "@/assets/icons/rightArrow.svg";

export type CarouselItem = PlayProps;

type CarouselProps = {
    items: CarouselItem[];
    compactOnShortScreen?: boolean;
};

export default function Carousel({ items, compactOnShortScreen = false }: CarouselProps) {

    // temp skeleton
    if (items.length === 0) {
        return (
            <div className="w-full overflow-x-auto scrollbar-thin flex gap-4 pb-3">
                <div className="sm:min-w-[240px] max-w-[260px] aspect-[300/200] rounded-[18px] bg-muted-2 animate-pulse flex-none" />
                <div className="sm:min-w-[240px] max-w-[260px] aspect-[300/200] rounded-[18px] bg-muted-2 animate-pulse flex-none" />
                <div className="sm:min-w-[240px] max-w-[260px] aspect-[300/200] rounded-[18px] bg-muted-2 animate-pulse flex-none" />
            </div>
        )
    };

    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollNext = () => {
        carouselRef.current?.scrollBy({
            left: carouselRef.current.clientWidth,
            behavior: "smooth"
        });
    };

    const scrollPrev = () => {
        carouselRef.current?.scrollBy({
            left: -carouselRef.current.clientWidth,
            behavior: "smooth"
        });
    };

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const handleScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            const buffer = 5

            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - buffer);
            
            setCanScrollLeft(scrollLeft > buffer);
        }
    };


                
    return (
        <div className="flex">

            <button onClick={scrollPrev} className={` mr-4 ${ canScrollLeft ? "hover:cursor-pointer" : "hover:cursor-not-allowed"} `}>
                <LeftArrowIcon className={` ${ canScrollLeft ? "text-foreground" : "text-foreground/25"} `}/>
            </button>

            <div ref={carouselRef} onScroll={handleScroll} className="w-full overflow-x-auto snap-x snap-proximity scrollbar-none flex gap-4 p-2 scroll-px-2">

                {items.map((item) => {
                    return <PlayCard key={ item.id } { ...item } playStyling={` min-w-[180px] sm:min-w-[220px] md:min-w-[240px] max-w-[260px] snap-start ${ compactOnShortScreen ? "h-34 w-auto" : ""  }`} />
                })}
                    
            </div>

            <button onClick={scrollNext} className={` ml-4 ${ canScrollRight ? "hover:cursor-pointer" : "hover:cursor-not-allowed"} `}>
                <RightArrowIcon className={` ${ canScrollRight ? "text-foreground" : "text-foreground/25"} `}/>
            </button>

        </div>
    );
};
