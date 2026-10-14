"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import { CreateAnnouncementCard, OldAnnouncement } from "@/app/executive-tools/_components/CreateAnnouncementCard";


export default function EditAnnouncement({ params }: { params: Promise<{ announcementId: string }>}) {
    const router = useRouter();
    const close = () => router.back();
    const { announcementId } = use(params)

    const [oldAnnouncement, setOldAnnouncement] = useState<OldAnnouncement | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchAnnouncement = async () => {
            setIsLoading(true);

            try {
                const response = await api.get(`/announcements/${announcementId}`);
                setOldAnnouncement(response.data);
            } catch (err) {
                console.error(err);
                setError("Could not load this announcement.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnnouncement()
    }, [announcementId]);

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

    if (error || !oldAnnouncement) {
        return <div className="flex h-full items-center justify-center">{error || "Announcement not found."}</div>;
    }


    return (
        <div className="absolute inset-0 bg-black/60 z-100 flex" onClick={close}>
            <div className="flex flex-1 min-w-0 h-full items-center justify-center py-15 px-8 
            z-110" >
                <div className="contents" onClick={(e) => e.stopPropagation()}>
                    <CreateAnnouncementCard oldAnnouncement={oldAnnouncement} />
                </div>
            </div>
        </div>
    )
};