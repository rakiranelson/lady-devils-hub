"use client";

import { useContext, useEffect } from "react";
import { SemesterContext } from "@/contexts/SemesterContext";
import Header from "@/components/Header";
import RosterToolBar from "./_components/RosterToolBar";
import { useRouter, useSearchParams } from "next/navigation";
import { RosterTable } from "./_components/RosterTable";
import useScrollFade from "@/hooks/useScrollFade";
import { slugify, unslugify } from "@/lib/slug";


export default function Roster() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const semester = useContext(SemesterContext)

  const seasonSlug = searchParams.get("season");
  const selectedSeason = seasonSlug ? unslugify(seasonSlug) : semester;

  const setSelectedSeason = (season: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", slugify(season));
    router.push(`?${ params.toString() }`)
  };

    useEffect(() => {
    if (!searchParams.get("season")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("season", slugify(semester));
      router.replace(`?${ params.toString() }`);
    }
  }, [searchParams, router]);

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