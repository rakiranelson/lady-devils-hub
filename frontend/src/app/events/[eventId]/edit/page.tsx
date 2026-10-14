import { redirect } from "next/navigation";
import { use } from "react";

export default function EventEditFallback({ params }: { params: Promise<{ eventId: string }> }){
    const { eventId } = use(params);
    redirect(`/events/${eventId}`);
}