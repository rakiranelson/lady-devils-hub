"use client";

import { useContext, useState, useMemo } from "react";
import { SemesterContext } from "@/contexts/SemesterContext"
import Header from "@/components/Header";
import EventToolBar from "./_components/EventToolBar";
import { EventContainer, Event } from "@/components/EventContainer";
import { useRouter, useSearchParams } from "next/navigation";
import useScrollFade from "@/hooks/useScrollFade";
import ScrollTop from "@/components/ScrollTop";

export default function Events() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const semester = useContext(SemesterContext);

  const past = searchParams.get("past") === "true";
  const setPast = (past: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (past === false) {
      params.delete("past");
    } else {
      params.set("past", "true")
    }
    router.push(`?${ params.toString() }`)
  };

  const activeFilter = searchParams.get("type")?.toLowerCase() ?? "all";
  const setActiveFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("type");
    } else {
      params.set("type", filter )
    }
    router.push(`?${ params.toString() }`)
  }

  // make sure this fetched happens on every refresh. put it in a useEffect and then setEvents to set the state
   const fetchedEvents: Event[] = [
    {
      id: 1,
      category: "practice",
      eventName: "Practice 9/3",
      locationName: "East Duke Lawn",
      dateLabel: "Thursday Sep 03",
      endDate: new Date(2026, 8, 3, 19),
      time: "5:00-7:00pm",
      practiceType: "Regular",
      response: "yes"
    },
    {
      id: 2,
      category: "tournament",
      eventName: "NIRSA Championship Tournament",
      locationName: "Charlottesville, VA",
      dateLabel: "Saturday Sep 05 - Sunday Sep 06",
      endDate: new Date(2026, 8, 6, 23, 59),
      time: null,
      response: null,
      tournamentType: "Regional",
      registered: false,
      registrationDeadline: "9/1 @ 12:00pm",
      deadline_passed: false
    },

    {
      id: 4,
      eventName: "Executive Board Meeting",
      locationName: "Perkins",
      category: "other",
      dateLabel: "Friday Sep 04",
      endDate: new Date(2026, 8, 4, 18, 45),
      time: "6:00-6:45pm",
      response: "yes"
    },

    {
      id: 3,
      category: "practice",
      eventName: "Practice 9/8",
      locationName: "Brodie Gym",
      dateLabel: "Tuesday Sep 08",
      endDate: new Date(2026, 8, 8, 19),
      time: "5:00-7:00pm",
      practiceType: "Conditioning",
      response: "yes"
    },

    {
      id: 5,
      category: "practice",
      eventName: "Practice 9/10",
      locationName: "East Duke Lawn",
      dateLabel: "Thursday Sep 10",
      endDate: new Date(2026, 8, 10, 19),
      time: "5:00-7:00pm",
      practiceType: "Regular",
      response: "yes"
    },

    {
      id: 6,
      category: "game",
      eventName: "Duke v NCCU",
      locationName: "NCCU's field",
      dateLabel: "Saturday Sep 12",
      endDate: new Date(2026, 8, 12, 14),
      time: "12:00-2:00pm",
      response: null,
    },

    {
      id: 7,
      eventName: "Wine Night",
      locationName: "Blue Light Apt 427",
      category: "other",
      dateLabel: "Friday Sep 11",
      endDate: new Date(2026, 8, 11, 18),
      time: "6:00pm",
      response: "yes"
    },

    {
      id: 8,
      category: "practice",
      eventName: "Practice 7/21",
      locationName: "Brodie Gym",
      dateLabel: "Tuesday Jul 21",
      endDate: new Date(2026, 6, 21, 19),
      time: "5:00-7:00pm",
      practiceType: "Conditioning",
      response: "yes"
    },
    {
      id: 9,
      category: "practice",
      eventName: "Practice 7/23",
      locationName: "East Duke Lawn",
      dateLabel: "Thursday Jul 23",
      endDate: new Date(2026, 6, 23, 19),
      time: "5:00-7:00pm",
      practiceType: "Regular",
      response: "yes"
    },
  ];

  // const [events, setEvents] = useState<Event[]>([]); 
  const [events, setEvents] = useState<Event[]>(fetchedEvents); 

  const filterCategories: Record<string, string[]> = {
    "practices": ["practice"],
    "competitions": ["tournament", "game"],
    "club-events": ["other"],
  };
  
  const filteredEvents = useMemo(() => {
    const now = new Date();
    const categories = filterCategories[activeFilter] ?? [];

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
        <EventToolBar past={ past } setPast={ setPast } activeFilter={ activeFilter } setActiveFilter={ setActiveFilter } eventCount={ eventCount }/>

        <div ref={ scrollContainer } onScroll={ handleScroll } className="overflow-y-auto h-full">
          <EventContainer eventList={ filteredEvents } skeletonCount={6}/>
        </div>

        <div className={`pointer-events-none absolute w-full bottom-0 h-15 bg-gradient-to-t from-background to-transparent transition-opacity duration-200 ${ showFade ? "opacity-100" : "opacity-0"}`}/>

        <ScrollTop containerRef={ scrollContainer }/>
      </div>


    </div>
  );
}
