"use client";

import { useContext } from "react";
import { SemesterContext } from "@/contexts/SemesterContext";
import Header from "@/components/Header";
import useScrollFade from "@/hooks/useScrollFade";
import ManagementContainer from "./_components/ManagementContainer";
import AnalyticsContainer from "./_components/AnalyticsContainer";

export default function Logistics() {

  const semester = useContext(SemesterContext)
  const { scrollContainer, handleScroll, showFade } = useScrollFade<HTMLDivElement>();
  return (
    <div className="h-full flex flex-col">
      <Header title="Executive Tools" semester={ semester }/>
      
      <div className="w-full max-w-[1050px] mx-auto px-5 mt-2 mb-2 pb-2 scrollbar-gutter-auto flex flex-col flex-1 min-h-0 relative">
      
              <div ref={ scrollContainer } onScroll={ handleScroll } className="flex flex-col overflow-y-auto h-full gap-4 pt-2">
                <ManagementContainer/>
                <AnalyticsContainer/>
              </div>
      
              <div className={`pointer-events-none absolute w-full bottom-0 h-15 bg-gradient-to-t from-background to-transparent transition-opacity duration-200 ${ showFade ? "opacity-100" : "opacity-0"}`}/>
            </div>
    </div>
  );
}
