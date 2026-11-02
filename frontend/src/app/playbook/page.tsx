"use client";

import { useContext, useEffect, useMemo } from "react";
import { SemesterContext } from "@/contexts/SemesterContext";
import Header from "@/components/Header";
import PlayFilter from "./_components/PlayFilter";
import { useRouter, useSearchParams } from "next/navigation";
import { PlayContainer} from "./_components/PlayContainer";
import { PlayProps } from "@/components/PlayCard";
import SearchBar from "@/components/SearchBar";
import useScrollFade from "@/hooks/useScrollFade";
import ScrollTop from "@/components/ScrollTop";

export default function Playbook() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const semester = useContext(SemesterContext);

  const activeFilter = searchParams.get("type") ?? "offense";
  const setActiveFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", filter);
    router.push(`?${ params.toString() }`)
  };

    useEffect(() => {
    if (!searchParams.get("type")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("type", "offense");
      router.replace(`?${ params.toString() }`);
    }
  }, [searchParams, router]);


      const plays: PlayProps[] = [
        // offense
        {
          id: 1,
          playName: "Durham",
          playType: "offense",
          playNumber: 1,
          thumbnail_url: "/playbook/thumbnails/cropped-play-1.jpg",
          animation_url: null,
        },

        {
          id: 2,
          playName: "Falcons",
          playType: "offense",
          playNumber: 2,
          thumbnail_url: "/playbook/thumbnails/cropped-play-2.jpg",
          animation_url: null,
        },

        {
          id: 3,
          playName: "Wake",
          playType: "offense",
          playNumber: 3,
          thumbnail_url: "/playbook/thumbnails/cropped-play-3.jpg",
          animation_url: null,
        },

        {
          id: 4,
          playName: "Twins X Motion",
          playType: "offense",
          playNumber: 4,
          thumbnail_url: "/playbook/thumbnails/cropped-play-4.jpg",
          animation_url: null,
        },

        {
          id: 5,
          playName: "9ers",
          playType: "offense",
          playNumber: 5,
          thumbnail_url: "/playbook/thumbnails/cropped-play-5.jpg",
          animation_url: null,
        },

        {
          id: 6,
          playName: "Chargers",
          playType: "offense",
          playNumber: 6,
          thumbnail_url: "/playbook/thumbnails/cropped-play-6.jpg",
          animation_url: null,
        },

        // route concepts
        {
          id: 7,
          playName: "HEELS",
          playType: "route-concepts",
          thumbnail_url: "/playbook/thumbnails/cropped-route-concept-1.jpg",
          animation_url: null,
        },
    
        {
          id: 8,
          playName: "DEVILS",
          playType: "route-concepts",
          thumbnail_url: "/playbook/thumbnails/cropped-route-concept-2.jpg",
          animation_url: null,
        },
    
        {
          id: 9,
          playName: "HOKIE",
          playType: "route-concepts",
          thumbnail_url: "/playbook/thumbnails/cropped-route-concept-3.jpg",
          animation_url: null,
        },
    
        {
          id: 10,
          playName: "EAGLE",
          playType: "route-concepts",
          thumbnail_url: "/playbook/thumbnails/cropped-route-concept-4.jpg",
          animation_url: null,
        },
    
        {
          id: 11,
          playName: "SEMINOLE",
          playType: "route-concepts",
          thumbnail_url: "/playbook/thumbnails/cropped-route-concept-5.jpg",
          animation_url: null,
        },
    
        {
          id: 12,
          playName: "PACK",
          playType: "route-concepts",
          thumbnail_url: "/playbook/thumbnails/cropped-route-concept-6.jpg",
          animation_url: null,
        },

        {
          id: 13,
          playName: "TIGERS",
          playType: "route-concepts",
          thumbnail_url: "/playbook/thumbnails/cropped-route-concept-7.jpg",
          animation_url: null,
        },

        {
          id: 14,
          playName: "CAVS",
          playNumber: 12,
          playType: "route-concepts",
          thumbnail_url: "/playbook/thumbnails/cropped-route-concept-8.jpg",
          animation_url: null,
        },

        // {
        //   id: 15,
        //   playName: "idk",
        //   playNumber: 12,
        //   playType: "defense",
        //   thumbnail_url: "/playbook/thumbnails/cropped-route-concept-6.jpg",
        //   animation_url: null,
        // }
      ];

  const filteredPlays = useMemo(() => {
    return plays.filter(play => play.playType === activeFilter) 
  }, [plays, activeFilter]);

  const { scrollContainer, showFade, handleScroll} = useScrollFade<HTMLDivElement>();

  const onSearch = () => { return null }; // change later

  return (

    <div className="h-full flex flex-col">
      <Header title="Team Playbook" semester={ semester }/>
      
        <div className="w-full max-w-[1050px] mx-auto px-5 mt-2 mb-2 pb-2 scrollbar-gutter-auto flex flex-col flex-1 min-h-0 relative">
          <div className="flex justify-between">
            <PlayFilter activeFilter={ activeFilter } setActiveFilter={ setActiveFilter }/>
            <SearchBar onSearch={ onSearch } placeholder="Search playbook..."/>
          </div>
  
          <div ref={ scrollContainer } onScroll={ handleScroll } className="overflow-y-auto h-full">
            <PlayContainer plays={ filteredPlays }/>
          </div>
  
          <div className={`pointer-events-none absolute w-full bottom-0 h-15 bg-gradient-to-t from-background to-transparent transition-opacity duration-200 ${ showFade ? "opacity-100" : "opacity-0"}`}/>
  
          <ScrollTop containerRef={ scrollContainer }/>
        </div>
    </div>
  );
}
