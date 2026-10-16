"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormCard } from "./FormCard";
import FormField from "./FormField";
import FormMultiSelect from "./FormMultiSelect";
import FormSingleSelect from "./FormSingleSelect";
import FormToggle from "./FormToggle";
import Checkbox from "./Checkbox";
import NoticeIcon from "@/assets/icons/notice.svg";
import getFormattedDate from "@/lib/getFormattedDate";
import { format, parse } from "date-fns";

import api from "@/lib/api";
import DatePickerDemo from "@/components/DatePicker";
import TimePicker from "@/components/TimePicker";

export type OldEvent = {
    id: number,
    name: string,
    category: string,
    locationName: string,
    locationAddress: string,
    details: string,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
    eventType: string,
    additionalRequirements: string[],
    registrationDeadlineDate: string,
    registrationDeadlineTime: string,
    isMultiDay: boolean,
    rsvpOpen: boolean,
};

type Props = {
    oldEvent?: OldEvent;
};

export function CreateEventCard({ oldEvent }: Props) {

    const [page, setPage] = useState(1);
    const [prevPage, setPrevPage] = useState(0);
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [submitError, setSubmitError] = useState<string>("");

    // page 1 form fields
    const [name, setName] = useState<string>(oldEvent?.name ?? "");
    const [startDate, setStartDate] = useState<Date | undefined>(oldEvent?.startDate ? parse(oldEvent.startDate, "MM-dd-yyyy", new Date()) : undefined );
    const [isMultiDay, setIsMultiDay] = useState<boolean>(oldEvent?.isMultiDay ?? false);
    const [endDate, setEndDate] = useState<Date | undefined>(oldEvent?.endDate ? parse(oldEvent.endDate, "MM-dd-yyyy", new Date()) : undefined );
    const [startTime, setStartTime] = useState<string>(oldEvent?.startTime ?? "");
    const [endTime, setEndTime] = useState<string>(oldEvent?.endTime ?? "");
    const [category, setCategory] = useState<string>(oldEvent?.category ?? "");
    const [eventType, setEventType] = useState<string>(oldEvent?.eventType ?? "");
    const [locationName, setLocationName] = useState<string>(oldEvent?.locationName ?? "");
    const [locationAddress, setLocationAddress] = useState<string>(oldEvent?.locationAddress ?? "");

    // page 2 form fields
    const [additionalRequirements, setAdditionalRequirements] = useState<string[]>(oldEvent?.additionalRequirements ?? []);
    const [registrationDeadlineDate, setRegistrationDeadlineDate] = useState<Date | undefined>(
        oldEvent?.registrationDeadlineDate
            ? parse(oldEvent.registrationDeadlineDate, "MM-dd-yyyy", new Date())
            : undefined
     );
    const [registrationDeadlineTime, setRegistrationDeadlineTime] = useState<string>(oldEvent?.registrationDeadlineTime ?? "");
    const [details, setDetails] = useState<string>(oldEvent?.details ?? "");
    const [autoOpenRSVP, setAutoOpenRSVP] = useState(oldEvent?.rsvpOpen ?? false);
    const isTentative =
        (
            startDate === undefined ||
            (locationName === "" && locationAddress === "") ||
            (isMultiDay ? endDate === undefined : (startTime === "" || endTime === ""))
        );

    const handleNext = () => {
        setError("");

        const missingFields: string[] = [];

        if (name.trim() === "") missingFields.push("Event Name");
        if (category.trim() === "") missingFields.push("Category");
        if ((category.trim() === "tournament" || category.trim() === "practice") && eventType === "") {
            missingFields.push(category === "tournament" ? "Tournament Type" : "Practice Type");
        }

        if (missingFields.length > 0) {
            setError(`Please fill in: ${missingFields.join(", ")}`);
            return;
        }

        !isTentative ? setAutoOpenRSVP(true) : setAutoOpenRSVP(false);

        setPrevPage(page);
        setPage(page + 1); 
    };

    useEffect(() => {
        setError("");
    }, [name, category, eventType, registrationDeadlineDate, registrationDeadlineTime]);

    const handleBack = () => {
        setError("");
        setPage(prevPage);
        setPrevPage(prevPage - 1);
    };

    const handleCancel = () => {
        router.back();
    };

    const handleSubmit = async () => {
        const missingFields: string[] = [];

        if (!isTentative && category === "tournament") {
            if (registrationDeadlineDate === undefined || registrationDeadlineTime == undefined) {
                missingFields.push("Registration Deadline");
            }
        }

        if (missingFields.length > 0) {
            console.log("blocked by missing fields", missingFields);
            setError(`Please fill in: ${missingFields.join(", ")}`);
            return;
        }    
        
        // if everything is good, call a post request
        const payload = {
            name: name.trim(),
            category: category.trim(),
            location_name: locationName === "" ? null : locationName.trim(),
            location_address: locationAddress === "" ? null : locationAddress.trim(),
            details: details === "" ? null : details,
            start_date: startDate ? format(startDate, "MM-dd-yyyy") : null,
            end_date: isMultiDay ? (endDate ? format(endDate, "MM-dd-yyyy") : null) : null ,
            start_time: !isMultiDay ? (startTime === "" ? null : startTime) : null,
            end_time: !isMultiDay ? (endTime === "" ? null : endTime) : null,

            // extra variables
            event_type: eventType === "" 
                ? null 
                : eventType.trim(),
            additional_requirements: (category === "tournament") 
                ? additionalRequirements 
                : null,
            registration_deadline_date: (category === "tournament" && registrationDeadlineDate)
                ? format(registrationDeadlineDate, "MM-dd-yyyy")
                : null,
            registration_deadline_time: (category === "tournament") 
                ? registrationDeadlineTime 
                : null,
            is_multi_day: isMultiDay,
            rsvp_open: autoOpenRSVP,
        };

        try {
            if (oldEvent?.id) {
                console.log("Updating event...");
                const response = await api.patch(`/events/${oldEvent.id}`, payload);
                window.dispatchEvent(new Event("event-updated"))
                router.back();

            } else {
                console.log("Creating event...");
                const response = await api.post("/events/", payload);
                console.log("SUCCESS", response.data);
                window.dispatchEvent(new Event("event-create"))

                // await router.replace("/events"); // change this later
                // router.push(`/events/${response.data.id}`);
                router.replace(`/events/${response.data.id}`);
            }    
        } catch (err) {
            console.error(err)
            setSubmitError("Something went wrong while saving the event. Please try again.")
        }

    };


    return (
        <FormCard cardTitle={ oldEvent?.id ?"Update Event" : "Create Event" }>
            { page === 1 && (
              <>
                <div className="flex flex-col gap-3 pb-5 border-b-1 border-muted-1/30">
                        <FormField 
                            formName="Event Name" 
                            placeholder="e.g. NCCU Scrimmage" 
                            required={true}
                            value={name}
                            onChange={setName}
                        />

                        <div className={` flex justify-between `}>
                            <div className="flex flex-col gap-1">
                                <DatePickerDemo
                                    formName={ isMultiDay ? "Start Date" : "Date"}
                                    date={startDate} 
                                    setDate={setStartDate}
                                    width={200}
                                />
                                <div className="select-none flex justify-between px-2 items-center">
                                    <span className={` text-base transition-all duration-300 ${isMultiDay ? "text-foreground/80" : "text-muted-2/70"}`}>Multi-day Event:</span>
                                    <FormToggle
                                        toggle={isMultiDay}
                                        onChange={setIsMultiDay}
                                        size={12}
                                    />
                                </div>
                                
                            </div>
                            
                            { isMultiDay ? 
                                (
                                    <DatePickerDemo
                                        formName={ isMultiDay ? "End Date" : "Date"}
                                        date={endDate} 
                                        setDate={setEndDate}
                                        formDependencies={[
                                            () => setStartTime(""), 
                                            () => setEndTime(""),
                                        ]}
                                        width={200}
                                    />
                                ) :
                                (
                                    <div className="flex gap-2">
                                        <TimePicker
                                            formName="Time"
                                            value={startTime}
                                            onChange={setStartTime}
                                            formDependencies={[
                                                () => setEndDate(undefined)
                                            ]}
                                            width={100}
                                        />

                                        <span className="w-3 border-b-2 border-foreground mb-10"/>
                                        <TimePicker 
                                            value={endTime}
                                            onChange={setEndTime}
                                            formDependencies={[
                                                () => setEndDate(undefined)
                                            ]}
                                            width={100}
                                        />
                                    </div>
                                )
                            }
                        </div>

                        <div className="flex justify-between">
                            <FormSingleSelect 
                                formName="Category" 
                                required={true}
                                selected={category}
                                onChange={setCategory}
                                options={[
                                    {label: "Practice", value: "practice"}, 
                                    {label: "Tournament", value: "tournament"},
                                    {label: "Game", value: "game"},
                                    {label: "Other", value: "other"},
                                ]}
                                formDependencies={[setEventType]}
                                width={200}
                                
                            />
                            { category == "tournament" &&
                                <FormSingleSelect 
                                    formName="Tournament Type" 
                                    required={true}
                                    selected={eventType}
                                    onChange={setEventType}
                                    options={[
                                        {label: "Regional", value: "regional"},
                                        {label: "National", value: "national"},
                                        {label: "Other", value: "other"},
                                    ]}
                                    width={200}
                                />
                            }

                            { category== "practice" &&
                                <FormSingleSelect 
                                    formName="Practice Type" 
                                    required={true}
                                    selected={eventType}
                                    onChange={setEventType}
                                    options={[
                                        {label: "Regular", value: "regular"},
                                        {label: "IQ", value: "iq"},
                                        {label: "Conditioning", value: "conditioning"},
                                        {label: "Film", value: "film"},
                                    ]}
                                    width={200}
                                />
                            }
                        </div>
                        
                    </div>

                    <div className="mt-4 text-[1.1rem] font-medium">
                        Location
                    </div>

                    <div className="flex flex-col gap-3 py-3">
                        <FormField 
                            formName="Display Name" 
                            placeholder="e.g. Cohan Fields" 
                            value={locationName}
                            onChange={setLocationName}
                        />
                        <FormField 
                            formName="Address"
                            placeholder="e.g. 148 Frank Basset Dr, Durham, NC 27705" 
                            value={locationAddress}
                            onChange={setLocationAddress}
                        />
                    </div>

                    { error !== "" && (
                        <div className="text-alert text-sm mb-2 bg-background/20 rounded-[5px] p-2 w-fit">{ error }</div>
                    )}

                    <div className="mt-auto mb-1 flex gap-5 items-center text-lg select-none">
                        <button onClick={ handleNext } className={`flex-1 font-semibold rounded-[3.5px] p-[6px] bg-muted-1 hover:bg-[hsl(242,73%,52%)] hover:shadow-button hover:cursor-pointer transition-all`}>Next</button>
                        <button onClick={ handleCancel } className="h-full flex px-3 items-center underline text-muted-1 hover:cursor-pointer hover:text-foreground">Cancel</button>
                    </div>

              </>
            )}

            { page === 2 && (
                <>
                    <div className="flex flex-col gap-4 pb-5 border-b-1 border-muted-1/30 flex-1">
                        <div className="flex flex-col flex-1" >
                            <FormField 
                                formName="Event Details (optional)" 
                                placeholder="e.g. Please bring cleats and/or gloves if you have them." 
                                multiline={true}
                                value={details}
                                onChange={setDetails}
                            />
                        </div> 
                        
                        { category === "tournament" && (
                            <div className="flex flex-col gap-3">
                                <FormMultiSelect 
                                    formName="Does this tournament require any additional registration details?"
                                    selected={additionalRequirements}
                                    onChange={setAdditionalRequirements}
                                    options={[
                                        {label: "Group\u00A0Transportation", value: "group_transportation"},
                                        {label: "Lodging", value: "lodging"},
                                    ]}
                                    openOnRight={true}
                                />
                                <div className="flex gap-2 items-end">
                                    <DatePickerDemo
                                        formName="Registration Deadline"
                                        required={isTentative ? false: true}
                                        date={registrationDeadlineDate} 
                                        setDate={setRegistrationDeadlineDate}
                                        width={200}
                                    />
                                    <span className="w-3 mb-1">@</span>
                                    <TimePicker 
                                        value={registrationDeadlineTime}
                                        onChange={setRegistrationDeadlineTime}
                                        width={100}
                                    />
                                    { error !== "" && (
                                        <div className="text-alert text-sm bg-background/20 rounded-[5px] px-2 w-fit h-fit">{ error }</div>
                                    )}
                                </div>
                            </div>
                            
                        )}
                    </div>

                    <div className="flex flex-col gap-3 py-3 mb-10">

                        { isTentative ?
                            <div className="bg-metadata/30 mt-2 rounded-[5px] flex items-center py-3 px-4 gap-x-5">
                        
                                <NoticeIcon className="text-[2.25rem] flex-none"/>
                                <span className="text-foreground/60 text-sm leading-snug">
                                    This event is missing a <span className="font-semibold underline">date</span>, <span className="font-semibold underline">time</span> and/or <span className="font-semibold underline">location</span>. It will be saved as a <span className="font-semibold underline">tentative event</span> until the remaining details are added.
                                </span>
                            </div>
                            :
                            <div className="flex flex-col gap-2 text-foreground/60">
                                <div>
                                    <span className="text-foreground/75 font-semibold">Note</span>
                                    <span className="text-metadata font-bold ml-1">*</span>
                                </div>
                                
                                <div className="text-sm leading-snug">
                                    This event will be saved as <span className="font-semibold underline">scheduled</span> and RSVP will automatically open for users. To keep RSVP closed until later, uncheck the option below.
                                </div>

                                <div className="text-[0.825rem] ">
                                    <Checkbox
                                        text="Automatically Open RSVP"
                                        check={autoOpenRSVP}
                                        onChange={setAutoOpenRSVP}
                                    />
                                </div>
                            </div>

                            
                        }  
                        
                    </div>

                    <div className="mt-auto mb-1 flex gap-5 items-center text-lg select-none">
                        <button onClick={ handleBack } className={`flex-[1] font-semibold rounded-[3.5px] p-[6px] bg-muted-1 hover:bg-muted-1/60 hover:shadow-button hover:cursor-pointer transition-all`}>Back</button>

                        <button onClick={ handleSubmit } className={`flex-[2] font-semibold rounded-[3.5px] p-[6px] bg-primary hover:bg-[hsl(242,73%,52%)] hover:shadow-button hover:cursor-pointer transition-all`}>{ `Save as ${ isTentative ? "Tentative" : "Scheduled"} `}</button>

                        <button onClick={ handleCancel } className="h-full flex px-3 items-center underline text-muted-1 hover:cursor-pointer hover:text-foreground">Cancel</button>
                    </div>

                </>      
                 
            )}
        </FormCard>

            

            
    )
};