"use client";

import { useContext } from "react";
import { SemesterContext } from "@/contexts/SemesterContext";
import Header from "@/components/Header";
import useScrollFade from "@/hooks/useScrollFade";
import CreateEventCard from "../_components/CreateEventCard";

export default function CreateEvent() {

  const semester = useContext(SemesterContext)
  const { scrollContainer, handleScroll, showFade } = useScrollFade<HTMLDivElement>();
  return (
    <div className="h-full flex flex-col">
      
      <div className="w-full max-w-[1050px] mx-auto px-5 pb-2 scrollbar-gutter-auto flex flex-col flex-1 min-h-0 relative">
      
              <div ref={ scrollContainer } onScroll={ handleScroll } className="flex justify-center items-center overflow-y-auto h-full">
                <CreateEventCard/>
              </div>
      
              <div className={`pointer-events-none absolute w-full bottom-0 h-15 bg-gradient-to-t from-background to-transparent transition-opacity duration-200 ${ showFade ? "opacity-100" : "opacity-0"}`}/>
            </div>
    </div>
  );
}
