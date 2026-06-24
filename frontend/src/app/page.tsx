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
      id: 3,
      category: "practice",
      eventName: "Practice 9/8",
      locationName: "Brodie Gym",
      date: "Thursday Sep 08",
      time: "5:00-7:00pm",
      practiceType: "Conditioning",
      response: "yes"
    },
  ]



  const semester = useContext(SemesterContext)
  return (
    <div className="h-full flex flex-col">
      <Header title="Overview" semester={ semester }></Header>
      
      <div className="w-full max-w-[1050px] mx-auto px-5 mt-2 overflow-y-auto scrollbar-gutter-stable">
        <AnnouncementContainer announcementList={ announcements }/>

        <div className="mt-2">
          <p>Upcoming</p>
          <EventContainer eventList={ events }/>
        </div>
       
      </div>

      <div>

      </div>
    </div>
  );
};
