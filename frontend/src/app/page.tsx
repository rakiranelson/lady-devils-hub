"use client";

import { useContext } from "react";
import { SemesterContext } from "@/contexts/SemesterContext"
import Header from "@/components/Header"
import AnnouncementContainer from "@/components/AnnouncementContainer";
import { AnnouncementProps } from "@/components/Announcement";
import EventContainer from "@/components/EventContainer";
import { Event } from "@/components/EventContainer";


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
  /* call a function to fetch the events with earliest date )from today) first */

  const events: Event[] = [
    {
      id: 1,
      eventName: "Practice 9/3",
      locationName: "East Duke Lawn",
      category: "practice",
      date: "Thursday Sep 03",
      time: "5:00-7:00pm"
    },
    {
      id: 2,
      eventName: "UVA Tournament",
      locationName: "University of Virginia",
      category: "tournament",
      date: "Saturday Sep 05 - Sunday Sep 06",
      time: null
    },
    {
      id: 3,
      eventName: "Practice 9/8",
      locationName: "Brodie Gym",
      category: "practice",
      date: "Thursday Sep 08",
      time: "5:00-7:00pm"
    },
  ]



  const semester = useContext(SemesterContext)
  return (
    <div className="h-full flex flex-col">
      <Header title="Overview" semester={ semester }></Header>
      
      <div className="ml-6 mr-6 mt-2 overflow-y-auto">
        <AnnouncementContainer announcementList={ announcements }></AnnouncementContainer>

        <div>
          <p>Upcoming</p>
          <EventContainer eventList={ events }></EventContainer>
        </div>
       
      </div>

      <div>

      </div>
    </div>
  );
};
