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
        {
          id: 1,
          playName: "Mesh Spot",
          playNumber: 1,
          playType: "offense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-1.jpg",
          animation_url: null,
        },
    
        {
          id: 2,
          playName: "Double Drive",
          playNumber: 2,
          playType: "offense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-2.jpg",
          animation_url: null,
        },
    
        {
          id: 3,
          playName: "Boot Flood",
          playNumber: 3,
          playType: "offense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-3.jpg",
          animation_url: null,
        },
    
        {
          id: 4,
          playName: "Slant Post Vert",
          playNumber: 4,
          playType: "defense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-4.jpg",
          animation_url: null,
        },
    
        {
          id: 5,
          playName: "Whip Levels",
          playNumber: 5,
          playType: "offense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-5.jpg",
          animation_url: null,
        },
    
        {
          id: 6,
          playName: "Ohio",
          playNumber: 6,
          playType: "offense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-6.jpg",
          animation_url: null,
        },
    
        {
          id: 7,
          playName: "Boot Slip",
          playNumber: 7,
          playType: "defense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-7.jpg",
          animation_url: null,
        },
    
        {
          id: 8,
          playName: "Boot Post Comeback",
          playNumber: 8,
          playType: "offense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-8.jpg",
          animation_url: null,
        },
    
        {
          id: 9,
          playName: "Slant Flats",
          playNumber: 9,
          playType: "offense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-8.jpg",
          animation_url: null,
        },
    
        {
          id: 10,
          playName: "Drag Whip",
          playNumber: 10,
          playType: "defense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-10.jpg",
          animation_url: null,
        },
    
        {
          id: 11,
          playName: "X Levels Cross",
          playNumber: 11,
          playType: "offense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-11.jpg",
          animation_url: null,
        },
    
        {
          id: 12,
          playName: "Z Alley Screen",
          playNumber: 12,
          playType: "offense",
          thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-12.jpg",
          animation_url: null,
        }
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
