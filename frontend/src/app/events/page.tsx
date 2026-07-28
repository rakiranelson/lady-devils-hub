"use client";

import { useContext, useState } from "react";
import { SemesterContext } from "@/contexts/SemesterContext"
import Header from "@/components/Header";
import EventToolBar from "./_components/EventToolBar";
import { EventContainer, Event } from "@/components/EventContainer";
import useScrollFade from "@/hooks/useScrollFade";
import ScrollTop from "./_components/ScrollTop";

export default function Events() {

  const semester = useContext(SemesterContext);
  const [upcoming, setUpcoming] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");

   const events: Event[] = [
    {
      id: 1,
      category: "practice",
      eventName: "Practice 9/3",
      locationName: "East Duke Lawn",
      date: "Thursday Sep 03",
      time: "5:00-7:00pm",
      practiceType: "Regular",
      response: "yes"
    },
    {
      id: 2,
      category: "tournament",
      eventName: "NIRSA Championship Tournament",
      locationName: "Charlottesville, VA",
      date: "Saturday Sep 05 - Sunday Sep 06",
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
      category: "Other",
      date: "Friday Sep 04",
      time: "6:00-6:45pm",
      response: "yes"
    },

    {
      id: 3,
      category: "practice",
      eventName: "Practice 9/8",
      locationName: "Brodie Gym",
      date: "Tuesday Sep 08",
      time: "5:00-7:00pm",
      practiceType: "Conditioning",
      response: "yes"
    },
    {
      id: 5,
      category: "practice",
      eventName: "Practice 9/10",
      locationName: "East Duke Lawn",
      date: "Thursday Sep 03",
      time: "5:00-7:00pm",
      practiceType: "Regular",
      response: "yes"
    },
    {
      id: 6,
      category: "game",
      eventName: "Duke v NCCU",
      locationName: "NCCU's field",
      date: "Saturday Sep 12",
      time: "12:00-2:00pm",
      response: null,
    },

    {
      id: 7,
      eventName: "Wine Night",
      locationName: "Blue Light Apt 427",
      category: "Other",
      date: "Friday Sep 11",
      time: "6:00pm",
      response: "yes"
    },
  ];

  const { scrollContainer, showFade, handleScroll } = useScrollFade<HTMLDivElement>();

  return (
    <div className="h-full flex flex-col">
      <Header title="Events" semester={ semester }/>
      
      <div className="w-full max-w-[1050px] mx-auto px-5 mt-2 mb-2 pb-2 scrollbar-gutter-auto flex flex-col flex-1 min-h-0 relative">
        <EventToolBar upcoming={ upcoming } setUpcoming={ setUpcoming } activeFilter={ activeFilter } setActiveFilter={ setActiveFilter }/>

        <div ref={ scrollContainer } onScroll={ handleScroll } className="overflow-y-auto h-full">
          <EventContainer eventList={ events } skeletonCount={6}/>
        </div>

        <div className={`pointer-events-none absolute w-full bottom-0 h-15 bg-gradient-to-t from-background to-transparent transition-opacity duration-200 ${ showFade ? "opacity-100" : "opacity-0"}`}/>

        <ScrollTop containerRef={ scrollContainer }/>
      </div>


    </div>
  );
}
