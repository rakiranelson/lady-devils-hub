"use client";

import { useContext } from "react";
import { SemesterContext } from "@/contexts/SemesterContext";
import useScrollFade from "@/hooks/useScrollFade";
import CreateAnnouncementCard from "../../_components/CreateAnnouncementCard";

export default function CreateAnnouncement() {

  const { scrollContainer, handleScroll, showFade } = useScrollFade<HTMLDivElement>();

  return (
      <>
          <div ref={ scrollContainer } onScroll={ handleScroll } className="flex justify-center items-center overflow-y-auto h-full">
            <CreateAnnouncementCard/>
          </div>
  
          <div className={`pointer-events-none absolute w-full bottom-0 h-15 bg-gradient-to-t from-background to-transparent transition-opacity duration-200 ${ showFade ? "opacity-100" : "opacity-0"}`}/>
      </>
     
  );
}
