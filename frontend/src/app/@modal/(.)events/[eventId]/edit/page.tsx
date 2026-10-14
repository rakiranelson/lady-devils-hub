"use client";

import { use, useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { CreateEventCard, OldEvent } from "@/app/executive-tools/_components/CreateEventCard";

import api from "@/lib/api";

export default function EditEvent({ params }: { params: Promise<{ eventId: string }> }){
    const router = useRouter();
    const close = () => router.back();
    const { eventId } = use(params);

    const [oldEvent, setOldEvent] = useState<OldEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true)

            try {
                const response = await api.get(`/events/${eventId}/form-responses`);
                setOldEvent(response.data);
            } catch (err) {
                console.error(err);
                setError("Could not load this event.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent()
    }, [eventId]);

    if (isLoading) {
        return (
            <div className="absolute inset-0 bg-black/60 z-100 flex" onClick={close}>
                <div className="flex flex-1 min-w-0 h-full items-center justify-center py-15 px-8 
                z-110" >
                    <div className="contents" onClick={(e) => e.stopPropagation()}>
                        <div className="aspect-[6/7] h-[650px] bg-navigation rounded-[10px] shadow-both-sides flex justify-center items-center text-lg">
                            Loading...
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !oldEvent) {
        return <div className="flex h-full items-center justify-center">{error || "Announcement not found."}</div>;
    }

    return (
        <div className="absolute inset-0 bg-black/60 z-100 flex" onClick={close}>
            <div className="flex flex-1 min-w-0 h-full items-center justify-center py-15 px-8 
            z-110" >
                <div className="contents" onClick={(e) => e.stopPropagation()}>
                    <CreateEventCard oldEvent={oldEvent} />
                </div>
            </div>
        </div>
    )
};