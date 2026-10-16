"use client";

import { useState, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SemesterContext } from "@/contexts/SemesterContext"
import Header from "@/components/Header"
import AnnouncementContainer from "@/components/AnnouncementContainer";
import { EventContainer, Event } from "@/components/EventContainer";
import Carousel from "@/components/Carousel";
import { CarouselItem } from "@/components/Carousel";
import useMediaQuery from "@/hooks/useMediaQuery";
import OpenPageIcon from "@/assets/icons/openPage.svg";
import Link from "next/link";

import api from "@/lib/api";


export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pathname = usePathname();


  const fetchEvents = async () => {
    setIsLoading(true);

    try {
        const response = await api.get("/events/overview?limit=4");
        const parsedEvents = response.data.map((event: any) => ({
            ...event,
            endDate: new Date(event.endDate),
        }));
        setEvents(parsedEvents);
    } catch (err) {
        console.error(err);
    } finally {
      setIsLoading(false);
    }
  }; 

  // initial load
  useEffect(() => {
      fetchEvents();
  }, []);

  useEffect(() => {
    window.addEventListener("event-updated", fetchEvents);; // will likely create new function to both fetch and display a confirmation message

    return () => window.removeEventListener("event-updated", fetchEvents);
  }, []);

  const plays: CarouselItem[] = [
    {
      id: 1,
      playName: "Durham",
      playNumber: 1,
      thumbnail_url: "/playbook/thumbnails/cropped-play-1.jpg",
      animation_url: null,
    },

    {
      id: 2,
      playName: "Falcons",
      playNumber: 2,
      thumbnail_url: "/playbook/thumbnails/cropped-play-2.jpg",
      animation_url: null,
    },

    {
      id: 3,
      playName: "Wake",
      playNumber: 3,
      thumbnail_url: "/playbook/thumbnails/cropped-play-3.jpg",
      animation_url: null,
    },

    {
      id: 4,
      playName: "Twins X Motion",
      playNumber: 4,
      thumbnail_url: "/playbook/thumbnails/cropped-play-4.jpg",
      animation_url: null,
    },

    {
      id: 5,
      playName: "9ers",
      playNumber: 5,
      thumbnail_url: "/playbook/thumbnails/cropped-play-5.jpg",
      animation_url: null,
    },

    {
      id: 6,
      playName: "Chargers",
      playNumber: 6,
      thumbnail_url: "/playbook/thumbnails/cropped-play-6.jpg",
      animation_url: null,
    },
  ];


  const semester = useContext(SemesterContext)

  const isThreeColumns = useMediaQuery("(min-width: 640px)");

  const visibleEvents =
    isThreeColumns === null // remove the null thing later
        ? []
        : isThreeColumns
        ? events.slice(0, 3)
        : events.slice(0, 4);

  
    const isShortScreen = useMediaQuery("(min-width: 53.125rem) and (max-height: 43.95rem)");
  
  return (
    <div className="h-full flex flex-col">
      <Header title="Overview" semester={ semester }/>
      
      <div className="w-full max-w-[1050px] mx-auto px-5 mt-2 overflow-y-auto scrollbar-gutter-auto mb-2">
        <AnnouncementContainer/>

        <div className="mt-3 sm:text-lg">
          <div className="flex">
            <p>Upcoming</p>
            <div className="ml-auto text-muted-1 hover:text-foreground hover:cursor-pointer">
              <Link href={ "/events" }>See All Events</Link>
              <OpenPageIcon className="inline text-[0.6rem] ml-2"/>
            </div>
          </div>
          
          <EventContainer 
            eventList={visibleEvents} 
            skeletonCount={3}
            isLoading={isLoading}
            onRefetch={fetchEvents}
          />
        </div>

        <div className="mt-4 sm:text-lg">
          <p>Wristband Playbook</p>
          <div className="max-w-[850px] mx-auto">
            <Carousel items={ plays } compactOnShortScreen={ !!isShortScreen }/>
          </div>
        </div>
       
      </div>

      <div>

      </div>
    </div>
  );
};
