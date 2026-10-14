"use client";

import { useState } from "react";
import { PracticeCard, PracticeProps } from "@/components/PracticeCard";
import { TournamentCard, TournamentProps } from "@/components/TournamentCard";
import { GenericEventCard, EventProps } from "@/components/GenericEventCard";
import EventSuspense from "@/components/EventSuspense";


export type Event = | PracticeProps | TournamentProps| EventProps;

type EventContainerProps = {
    eventList: Event[]
    skeletonCount: number;
    isLoading: boolean;
    onRefetch: () => void;
};

export function EventContainer({ eventList, skeletonCount, isLoading = false, onRefetch }: EventContainerProps) {

    if (isLoading) {
        return <EventSuspense count={ skeletonCount }/>
    };
                
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 p-1 gap-4 justify-between rounded-[5px]">

                { eventList.length === 0 && (
                    <div className="pl-3 text-lg text-foreground/75">
                        No events found.
                    </div>
                )}

                {eventList.map((event) => {
                    if (event.category === "practice") {
                        return <PracticeCard key={ event.id } { ...event } onRefetch={onRefetch} />;
                    }

                    if (event.category === "tournament") {
                        return <TournamentCard key={ event.id } { ...event } onRefetch={onRefetch}/>;
                    }

                    return <GenericEventCard key={ event.id } { ...event } onRefetch={onRefetch}/>
                })}
                    
        </div>
    );
};
