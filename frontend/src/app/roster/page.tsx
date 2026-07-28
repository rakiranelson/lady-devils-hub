"use client";

import { useContext, useState } from "react";
import { SemesterContext } from "@/contexts/SemesterContext";
import Header from "@/components/Header";
import RosterToolBar from "./_components/RosterToolBar";
import { RosterTable } from "./_components/RosterTable";
import useScrollFade from "@/hooks/useScrollFade";


export default function Roster() {

  const semester = useContext(SemesterContext)

  const [selectedSeason, setSelectedSeason] = useState(semester)

  const { scrollContainer, showFade, handleScroll } = useScrollFade<HTMLDivElement>();
  return (
    <div className="h-full flex flex-col">
      <Header title="Roster" semester={ semester }/>
      
      <div className="w-full max-w-[1050px] mx-auto px-5 mb-2 pb-2 mt-1 scrollbar-gutter-auto flex flex-col flex-1 min-h-0 relative">
        <RosterToolBar selectedSeason={ selectedSeason } setSelectedSeason={ setSelectedSeason }/>

        <div ref={ scrollContainer } onScroll={ handleScroll } className="overflow-auto h-full">
          <RosterTable season={ selectedSeason }/>
        </div>

        <div className={`pointer-events-none absolute w-full bottom-0 h-25 bg-gradient-to-t from-background to-transparent transition-opacity duration-200 ${ showFade ? "opacity-100" : "opacity-0"}`}/>

      </div>

    </div>


  );
};