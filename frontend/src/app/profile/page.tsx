"use client";

import { useContext } from "react";
import { SemesterContext } from "@/contexts/SemesterContext";
import Header from "@/components/Header";
import { PositionChip, Position } from "@/components/PositionChip";
import { InfoCard, InfoCardProps } from "./_components/InfoCard";
import { DetailsDisplay, DisplayProps } from "./_components/DetailsDisplay";
import PlayerInfoRow from "./_components/PlayerInfoRow";
import { StatCard, StatCardProps } from "./_components/StatCard";
import { chipColors } from "@/lib/chipColors";


export default function Profile() {

  const semester = useContext(SemesterContext)

  const UserInfo: DisplayProps[] = [
    {
      label: "Name",
      info: "Anita Maxwynn"
    },
    {
      label: "Email",
      info: "am63@duke.edu"
    },
    {
      label: "Phone #",
      info: "(123) 456-7890"
    },
    {
      label: "Member Type",
      info: "Player"
    },
    {
      label: "Executive Position",
      info: "None"
    },
  ];
  
  type PlayerInfo = {
    jersey: string;
    positions: Position[]
    joined: string;
  };

  const player: PlayerInfo = {
    jersey: "08",
    positions: [
      { abbrev: "C", full: "Center" },
      { abbrev: "LB", full: "Linebacker" }, 
      { abbrev: "WR", full: "Wide Receiver" }
    ],
    joined: "Fall 2024"
  };

  const stats: StatCardProps[] = [
    { heading: "Practices", value: 13 },
    { heading: "Competitions", value: 2 },
    { heading: "Tournaments", value: 0 }
  ];

  return (
    <div className="h-full flex flex-col">
      <Header title="My Profile" semester={ semester }/>
      
      <div className="w-full max-w-[1050px] mx-auto px-5 mt-2 overflow-y-auto scrollbar-gutter-auto mb-2">

        <div className="flex flex-col md:flex-row gap-3 mt-3">

          <InfoCard className="md:flex-[3] min-h-[412px] bg-card" heading="Member Details" canEdit={ true }>
            <div className="flex flex-col gap-5">
              { UserInfo.map((item) => (
                <DetailsDisplay key={ item.label } label={ item.label } info={ item.info }/>
              ))}
            </div>
          </InfoCard>

          <div className="md:flex-[4] flex flex-col gap-3 min-h-[412px]">
            
            <InfoCard className="bg-navigation flex-[3]" heading="Player Profile" canEdit={ true }>
              <div className="flex flex-col gap-2">
                <PlayerInfoRow label="Jersey #">{ player.jersey }</PlayerInfoRow>
                <PlayerInfoRow label="Preferred Position(s)">
                  <div className="flex gap-2">
                    { player.positions.map((position, index) => (
                      <PositionChip key={ position.full } abbrev={ position.abbrev } full={ position.full } color={ chipColors[index % chipColors.length] }/>
                    ))}
                  </div>
                </PlayerInfoRow>
                <PlayerInfoRow label="Joined">{ player.joined }</PlayerInfoRow>
              </div>
            </InfoCard>

            <InfoCard className="bg-navigation flex-[4]" heading={ ` Attendance [${ semester}]`}>
              <div className="flex gap-4 justify-between max-w-[450px] mx-auto">
                { stats.map((stat) => (
                  <StatCard key={ stat.heading } heading={ stat.heading } value={ stat.value }></StatCard>
                ))}
              </div>
            </InfoCard>
          </div>

        </div>
      </div>
    </div>
  );
};