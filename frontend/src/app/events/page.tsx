"use client";

import { useContext, useState, useMemo, useEffect } from "react";
import { SemesterContext } from "@/contexts/SemesterContext"
import Header from "@/components/Header";
import EventToolBar from "./_components/EventToolBar";
import { EventContainer, Event } from "@/components/EventContainer";
import { useRouter, useSearchParams } from "next/navigation";
import useScrollFade from "@/hooks/useScrollFade";
import ScrollTop from "@/components/ScrollTop";

import api from "@/lib/api";

export default function Events() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const semester = useContext(SemesterContext);
  const [past, setPast] = useState(searchParams.get("past") === "true");
  const [activeFilter, setActiveFilter] = useState(searchParams.get("type")?.toLowerCase() ?? "all");

  const handlePastChange = (past: boolean) => {
    setPast(past);
    const params = new URLSearchParams(searchParams.toString());
    if (past === false) {
      params.delete("past");
    } else {
      params.set("past", "true")
    }
    router.push(`?${ params.toString() }`)
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("type");
    } else {
      params.set("type", filter )
    }
    router.push(`?${ params.toString() }`)
  }

   const [events, setEvents] = useState<Event[]>([]); 

   useEffect(() => {
    const fetchEvents = async () => {
        try {
            const response = await api.get("/events/");
            const parsedEvents = response.data.map((event: any) => ({
                ...event,
                endDate: new Date(event.endDate),
            }));
            setEvents(parsedEvents);
        } catch (err) {
            console.error(err);
        }
    };

    fetchEvents();
    }, []);


  const filterCategories: Record<string, string[]> = {
    "practices": ["practice"],
    "competitions": ["tournament", "game"],
    "club-events": ["other"],
  };
  
  const filteredEvents = useMemo(() => {
    const now = new Date();
    const categories = filterCategories[activeFilter];

    return events.filter((event) => {
      const matchesCategory = activeFilter === "all" || categories.includes(event.category);
      const matchesTiming = past ? event.endDate < now : event.endDate >= now;
      return matchesCategory && matchesTiming;
    });
  }, [events, activeFilter, past]);

  const eventCount = filteredEvents.length;

  const { scrollContainer, showFade, handleScroll } = useScrollFade<HTMLDivElement>();

  return (
    <div className="h-full flex flex-col">
      <Header title="Events" semester={ semester }/>
      
      <div className="w-full max-w-[1050px] mx-auto px-5 mt-2 mb-2 pb-2 scrollbar-gutter-auto flex flex-col flex-1 min-h-0 relative">
        <EventToolBar past={ past } setPast={ handlePastChange } activeFilter={ activeFilter } setActiveFilter={ handleFilterChange } eventCount={ eventCount }/>

        <div ref={ scrollContainer } onScroll={ handleScroll } className="overflow-y-auto h-full">
          <EventContainer eventList={ filteredEvents } skeletonCount={6}/>
        </div>

        <div className={`pointer-events-none absolute w-full bottom-0 h-15 bg-gradient-to-t from-background to-transparent transition-opacity duration-200 ${ showFade ? "opacity-100" : "opacity-0"}`}/>

        <ScrollTop containerRef={ scrollContainer }/>
      </div>


    </div>
  );
}
