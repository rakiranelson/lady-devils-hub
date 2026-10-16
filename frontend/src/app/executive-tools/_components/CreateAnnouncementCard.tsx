"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormCard, Option } from "./FormCard";
import FormField from "./FormField";
import Checkbox from "./Checkbox";
import DatePickerDemo from "@/components/DatePicker";
import TimePicker from "@/components/TimePicker";

import api from "@/lib/api";
import getFormattedDate from "@/lib/getFormattedDate";

import { format, parse } from "date-fns";

export type OldAnnouncement = {
    id: number,
    content: string,
    expirationDate: string,
    expirationTime: string,
    pinned: boolean,
};

type Props = {
    oldAnnouncement?: OldAnnouncement;
};

export function CreateAnnouncementCard({ oldAnnouncement }: Props) {

    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [submitError, setSubmitError] = useState<string>("");

    const placeholderDate = getFormattedDate(7);

    // page 1 form fields
    const [content, setContent] = useState<string>(oldAnnouncement?.content ?? "");
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    oldAnnouncement?.expirationDate
        ? parse(oldAnnouncement.expirationDate, "MM-dd-yyyy", new Date())
        : undefined
    );
    const [expirationTime, setExpirationTime] = useState<string>(oldAnnouncement?.expirationTime ?? "");
    const [pinned, setPinned] = useState<boolean>(oldAnnouncement?.pinned ?? false);


    const handleCancel = () => {
        router.back();
    };

    const handleSubmit = async () => {
        const missingFields: string[] = [];

        if (content.trim() === "") missingFields.push("Announcement Message")
        if (expirationDate === undefined || expirationTime === undefined) missingFields.push("Expiration Date");

        if (missingFields.length > 0) {
            console.log("blocked by missing fields", missingFields);
            setError(`Please fill in: ${missingFields.join(", ")}`);
            return;
        }
        
        const payload = {
            content: content,
            expiration_date: expirationDate ? format(expirationDate, "MM-dd-yyyy") : null,
            expiration_time: expirationTime,
            pinned: pinned,
        };

        try {
            if (oldAnnouncement?.id) {
                console.log("Updating announcement...")
                await api.patch(`/announcements/${oldAnnouncement.id}`, payload);
                window.dispatchEvent(new Event("announcement-updated"));
                router.back();
            } else {
                console.log("Creating announcement...")
                await api.post("/announcements/", payload);
                window.dispatchEvent(new Event("announcement-created"));
                router.push("/");
            }
        } catch (err) {
            console.error(err)
            setSubmitError("Something went wrong while creating/updating the announcement. Please try again.")
        }
        
        
    };

    useEffect(() => {
        setError("");
    }, [content, expirationDate, expirationTime]);

    return (
        <FormCard cardTitle={ oldAnnouncement?.id ?"Update Announcement" : "Create Announcement" }>

              <>
                <div className="flex flex-col gap-3 pb-5 border-b-1 border-muted-1/30">
                    <FormField 
                        formName="Message" 
                        placeholder="Please complete the poll indicating your availability by 10-15-2026." 
                        required={true}
                        value={content}
                        onChange={setContent}
                        multiline={true}
                    />
                    <div className="flex gap-5">
                        <DatePickerDemo
                            formName="Announcement Expiration"
                            required={true}
                            date={expirationDate} 
                            setDate={setExpirationDate}
                            width={200}
                        />
                        <TimePicker 
                            value={expirationTime}
                            onChange={setExpirationTime}
                            width={100}
                        />
                    </div>
                 </div>

                 <div className="mt-4 mb-2">
                    <Checkbox
                        text="Pin this announcement"
                        check={pinned}
                        onChange={setPinned}
                    />
                 </div>
                        

                { error !== "" && (
                    <div className="text-alert text-sm mb-2 bg-background/20 rounded-[5px] p-2 w-fit">{ error }</div>
                )}

                <div className="mt-auto mb-1 flex gap-5 items-center text-lg select-none">
                    <button onClick={ handleSubmit } className={`flex-1 font-semibold rounded-[3.5px] p-[6px] bg-primary hover:bg-[hsl(242,73%,52%)] hover:shadow-button hover:cursor-pointer transition-all`}>{ oldAnnouncement?.id ?"Update" : "Submit" }</button>
                    <button onClick={ handleCancel } className="h-full flex px-3 items-center underline text-muted-1 hover:cursor-pointer hover:text-foreground">Cancel</button>
                </div>
               
              </>

        </FormCard>    
            
    )
};