"use client";

import { useContext, useRef, useState} from "react";
import { SemesterContext } from "@/contexts/SemesterContext";
import { UserContext } from "@/contexts/CurrentUserContext";
import { ModalContext } from "@/contexts/ModalContext";

import Button from "@/components/Button"
import MoreDetails from "@/components/MoreDetails";
import Image from "next/image";
import InfoCard from "./events/InfoCard";
import DetailsContainer from "./events/DetailsContainer";
import GoBack from "./events/GoBack";

// icons
import CalendarIcon from "@/assets/icons/calendar.svg";
import TimeIcon from "@/assets/icons/time.svg";
import LocationIcon from "@/assets/icons/location.svg";


import { RVSPList } from "./events/RSVPList";
import RSVPChip from "./events/RSVPChip";
export type EventProps = {
    id: number;
    eventName: string;
    locationName: string;
    category: string;
    dateLabel: string;
    endDate: Date;
    time: string;
    response?: string | null;
};

// types for event details card
export type ExtendedEventProps = {
    id: number;
    category: string;
    eventName: string;
    locationName: string;
    locationAddress: string;
    dateLabel: string;
    time: string;
    response: string | null;
    details: string;
};

export function GenericEventCard(event : EventProps) {
    return (
        <div className="max-w-[260px] md:max-w-[304px] aspect-[304/259]  flex flex-col text-sm bg-card rounded-[18px] hover:scale-102 transition-transform duration-200 select-none">
        
                    <div className="w-full h-2/9 rounded-t-[18px] overflow-hidden relative">

                        { event.category === "game" && (
                            <Image
                                className="object-cover object-[30%_70%] opacity-40"
                                src="/solo-game.png"
                                alt="Game Banner"
                                fill={ true }
                                priority
                            />
                        )}

                        { event.category != "game" && (
                            <Image
                                className="object-cover object-[30%_30%] opacity-40"
                                src="/community.jpg"
                                alt="Community Banner"
                                fill={ true }
                                priority
                            />
                        )}
                        
                        
                    </div>

            <div className="px-3 pt-2">
                <div>
                    <div className="text-[min(1.3rem,3.5vw)] font-semibold truncate" title="">
                        { event.eventName }
                    </div>

                    <div className="text-metadata text-[min(0.875rem,2.5vw)] -mt-1 truncate">
                        <span className="invisible">Placeholder</span>
                    </div>

                    <div className="text-[min(1rem,3vw)] mt-2 flex items-center gap-2">
                        <CalendarIcon className="overflow-visible"/>
                        <span className="truncate">{ event.dateLabel }</span>
                    </div>

                    <div className="text-[min(1rem,3vw)] flex items-center gap-2">
                        <TimeIcon className="overflow-visible"/>
                        <span className="truncate">{ event.time }</span>
                    </div>

                    <div className="text-[min(1rem,3vw)] flex items-center gap-2">
                        <LocationIcon className="overflow-visible"/>
                        <span className="truncate">{ event.locationName }</span>
                    </div>

                     <div className="flex flex-wrap justify-between mt-4 sm:mt-7 pb-4 text-[min(0.875rem,2.5vw)]">
                        { (event.response === "yes" || event.response === "maybe" || event.response === "no") ?
                            ( <RSVPChip response={ event.response } hiddenEdit={true}/> ) : 
                            ( <Button title="RSVP Now"/> )
                        }

                        <div className="flex items-center h-[28px]">
                            <MoreDetails title="Details" href={`/events/${event.id}`} color="muted-2"/>
                        </div>
                    </div>

                </div>
            </div>


        </div>
    );
};

export function EventDetails(event : ExtendedEventProps) {
    
    const semester = useContext(SemesterContext);
    const isExec = useContext(UserContext)?.exec;
    const isModal = useContext(ModalContext);

    const detailsWrapperRef = useRef<HTMLDivElement>(null);
    const [frozenHeight, setFrozenHeight] = useState<number | null>(null);
    const [RSVPHeight, setRSVPHeight] = useState<number | null>(null);
    
    const handleRSVPOpen = () => {
        if (detailsWrapperRef.current && frozenHeight === null) {
            setFrozenHeight(detailsWrapperRef.current.offsetHeight);
        }
        if (scrollContainer.current) {
            setRSVPHeight(scrollContainer.current.offsetHeight - (window.innerWidth >= 640 ? 50 : 45));

        }
    };

    const handleRSVPClose = () => {
        setFrozenHeight(null);
    };

    const scrollContainer = useRef<HTMLDivElement>(null);

    return (
        <div className={`aspect-[360/300] min-h-0 mx-auto flex flex-col text-sm bg-card rounded-[18px] shadow-large-card ${isModal ? "animate-grow" : ""}`} style={{ width: "min(calc((100vh - 120px) * (360/300)), 100%)" }}>
            <div className="w-full h-1/8 rounded-t-[18px] overflow-hidden relative select-none">
                <Image
                    className="object-cover object-[30%_60%] opacity-40"
                    src="/practices.png"
                    alt="Practice Banner"
                    fill={ true }
                    priority
                />
            </div>

                <div className="h-full px-7 pt-2 flex flex-col min-h-0">
                    
                    <div className="flex-none">
                        <div className="text-[min(2.1rem,5vw)] font-bold truncate" title="">
                            { event.eventName }
                        </div>

                        <div className="-mt-2 flex justify-between mb-1 text-base">
                            <span className="text-metadata text-[min(1.2rem,2.6vw)] truncate font-medium">{ semester }</span>

                            { (event.response === "yes" || event.response === "maybe" || event.response === "no") ?
                                ( <RSVPChip response={ event.response }/> ) : 
                                ( <Button title="RSVP Now" width={100} /> )
                            }
                            
                        </div>
                    </div>

                    <div ref={ scrollContainer } className="flex-1 min-h-0 overflow-y-auto flex flex-col">
                        <div className="flex gap-5 justify-center mt-4 mb-4">
                            <InfoCard 
                                icon={ <CalendarIcon className="text-foreground text-[2.2rem]"/> }
                                label={ event.dateLabel }
                                details={ event.time }
                            />
                            <InfoCard 
                                icon={ <LocationIcon className="text-foreground text-[2.2rem] overflow-visible"/> }
                                label={ event.locationName }
                                details={ event.locationAddress }
                            />
                        </div>
                        
                        <div ref={ detailsWrapperRef } className={` mt-1 ${ frozenHeight === null ? "flex-1 min-h-0" : "flex-none"} overflow-hidden`} style={ frozenHeight !== null ? { height: frozenHeight } : undefined }>
                            <DetailsContainer content={ event.details }/>
                        </div>

                        { event.response !== null && (
                            <div className="flex-none mt-4 pb-1">
                            { isExec && (
                                <RVSPList 
                                    label="Responses" 
                                    handleRSVPOpen={ handleRSVPOpen }
                                    handleRSVPClose={ handleRSVPClose }
                                    pageScrollRef={ scrollContainer }
                                    maxHeight={ RSVPHeight }/>
                            )}

                            { !isExec && (
                                <RVSPList label="Attendees" handleRSVPOpen={ handleRSVPOpen } handleRSVPClose={ handleRSVPClose }
                                pageScrollRef={ scrollContainer }
                                maxHeight={ RSVPHeight }/>
                            )}   
                        </div>
                        )}

                    </div>


                        <div className="flex text-[min(0.875rem,2.5vw)] mb-3">
                            <div className="flex items-center h-[28px] ml-auto">
                                <GoBack title="Back" color="muted-2"/>
                            </div>
                        </div>


                </div>
            
            

        </div>
    );
};
