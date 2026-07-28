"use client";

import { useContext } from "react";
import { SemesterContext } from "@/contexts/SemesterContext"
import Header from "@/components/Header"
import AnnouncementContainer from "@/components/AnnouncementContainer";
import { AnnouncementProps } from "@/components/Announcement";
import { EventContainer, Event } from "@/components/EventContainer";
import Carousel from "@/components/Carousel";
import { CarouselItem } from "@/components/Carousel";
import useMediaQuery from "@/hooks/useMediaQuery";
import OpenPageIcon from "@/assets/icons/openPage.svg";
import Link from "next/link";


export default function Home() {

/* call a function to fetch the announcements with most recent created time coming first */
  const announcements: AnnouncementProps[]= [
          {
              id: 3,
              content: "Tournament RSVP posted",
              expiresAt: "Sep 10",
              createdBy: "Ra'Kira Nelson",
              pinned: true,
              createdTime: "6 hours ago"
          },
  
          {
              id: 2,
              content: "Complete waiver before Saturday scrimmage. Players without completed waivers cannot participate.",
              expiresAt: "Sep 03",
              createdBy: "Ra'Kira Nelson",
              pinned: false,
              createdTime: "4 days ago"
          },
  
          {
              id: 1,
              content: "Practice location poll posted",
              expiresAt: "Sep 04",
              createdBy: "Ra'Kira Nelson",
              pinned: false,
              createdTime: "1 week ago"
          },
      ];
  /* call a function to fetch the events with earliest date  from today) first */

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
      date: "Friday Sep 11",
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
  ];

  const plays: CarouselItem[] = [
    {
      id: 1,
      playName: "Mesh Spot",
      playNumber: 1,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-1.jpg",
      animation_url: null,
    },

    {
      id: 2,
      playName: "Double Drive",
      playNumber: 2,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-2.jpg",
      animation_url: null,
    },

    {
      id: 3,
      playName: "Boot Flood",
      playNumber: 3,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-3.jpg",
      animation_url: null,
    },

    {
      id: 4,
      playName: "Slant Post Vert",
      playNumber: 4,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-4.jpg",
      animation_url: null,
    },

    {
      id: 5,
      playName: "Whip Levels",
      playNumber: 5,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-5.jpg",
      animation_url: null,
    },

    {
      id: 6,
      playName: "Ohio",
      playNumber: 6,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-6.jpg",
      animation_url: null,
    },

    {
      id: 7,
      playName: "Boot Slip",
      playNumber: 7,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-7.jpg",
      animation_url: null,
    },

    {
      id: 8,
      playName: "Boot Post Comeback",
      playNumber: 8,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-8.jpg",
      animation_url: null,
    },

    {
      id: 9,
      playName: "Slant Flats",
      playNumber: 9,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-8.jpg",
      animation_url: null,
    },

    {
      id: 10,
      playName: "Drag Whip",
      playNumber: 10,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-10.jpg",
      animation_url: null,
    },

    {
      id: 11,
      playName: "X Levels Cross",
      playNumber: 11,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-11.jpg",
      animation_url: null,
    },

    {
      id: 12,
      playName: "Z Alley Screen",
      playNumber: 12,
      thumbnail_url: "/playbook/thumbnails/cropped-playbook 26-page-12.jpg",
      animation_url: null,
    }
  ];


  const semester = useContext(SemesterContext)

  const isThreeColumns = useMediaQuery("(min-width: 640px)");

  const visibleEvents =
    isThreeColumns === null // remove the null thing later
        ? null
        : isThreeColumns
        ? events.slice(0, 3)
        : events.slice(0, 4);

  
    const isShortScreen = useMediaQuery("(min-width: 53.125rem) and (max-height: 43.9rem)");
  
  return (
    <div className="h-full flex flex-col">
      <Header title="Overview" semester={ semester }/>
      
      <div className="w-full max-w-[1050px] mx-auto px-5 mt-2 overflow-y-auto scrollbar-gutter-auto mb-2">
        <AnnouncementContainer announcementList={ announcements }/>

        <div className="mt-3 sm:text-lg">
          <div className="flex">
            <p>Upcoming</p>
            <div className="ml-auto text-muted-1 hover:text-foreground hover:cursor-pointer">
              <Link href={ "/events" }>See All Events</Link>
              <OpenPageIcon className="inline text-[0.6rem] ml-2"/>
            </div>
          </div>
          
          <EventContainer eventList={ visibleEvents } skeletonCount={3}/>
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
