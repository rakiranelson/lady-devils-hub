"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormCard, Option} from "./FormCard";
import FormField from "./FormField";
import FormMultiSelect from "./FormMultiSelect";
import FormSingleSelect from "./FormSingleSelect";
import FormToggle from "./FormToggle";
import NoticeIcon from "@/assets/icons/notice.svg";
import SelectCheckIcon from "@/assets/icons/selectCheck.svg";


export default function CreateEventCard() {
    const [page, setPage] = useState(1);
    const [prevPage, setPrevPage] = useState(0);
    const router = useRouter();

    // onclick needs to set state and render the correct parts of the form by submitting to backend and getting a specialized state

    // page 1 form fields
    const [name, setName] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [isMultiDay, setIsMultiDay] = useState<boolean>(false);
    const [endDate, setEndDate] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [eventType, setEventType] = useState<string>("");
    const [locationName, setLocationName] = useState<string>("");
    const [locationAddress, setLocationAddress] = useState<string>("");

    // page 2 form fields
    const [additionalRequirements, setAdditionalRequirements] = useState<string[]>([]);
    const [registrationDeadline, setRegistrationDeadline] = useState<string>("");
    const [details, setDetails] = useState<string>("");
    const [autoOpenRSVP, setAutoOpenRSVP] = useState(false);

    const isTentative =
        (
            startDate === "" ||
            (locationName === "" && locationAddress === "") ||
            (isMultiDay ? endDate === "" : startTime === "")
        );


    const [error, setError] = useState<string>("");

    const handleNext = () => {
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
        setError("");

        setPrevPage(page);
        setPage(page + 1); 
    };

    useEffect(() => {
        setError("");
    }, [name, category, eventType, registrationDeadline]);

    const handleBack = () => {
        setPage(prevPage)
        setPrevPage(prevPage - 1)
    };

    const handleCancel = () => {
        router.back();
        // get rid of temp event id
    };

    const handleSubmit = () => {
        const missingFields: string[] = [];

        if (!isTentative) {
            if (registrationDeadline === "") missingFields.push("Registration Deadline")
        }

        if (missingFields.length > 0) {
            setError(`Please fill in: ${missingFields.join(", ")}`);
            return;
        }        
    };

    return (
        <FormCard cardTitle="Create Event">
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
                                <FormField 
                                    formName={ isMultiDay ? "Start Date" : "Date"} 
                                    placeholder="02/01/2025" 
                                    value={startDate}
                                    onChange={setStartDate}
                                    width={150}
                                />
                                <div className="select-none flex justify-between px-2 items-center">
                                    <span className={` text-sm transition-all duration-300 ${isMultiDay ? "text-foreground/80" : "text-muted-2/70"}`}>Multi-day Event:</span>
                                    <FormToggle
                                        toggle={isMultiDay}
                                        onChange={setIsMultiDay}
                                        size={10}
                                    />
                                </div>
                                
                            </div>
                            
                            { isMultiDay ? 
                                (
                                    <FormField
                                        formName="End Date"
                                        placeholder="02/03/2025" 
                                        value={endDate}
                                        onChange={setEndDate}
                                        formDependencies={[setStartTime, setEndTime]}
                                        width={150}
                                    />
                                ) :
                                (
                                    <div className="flex gap-2">
                                        <FormField 
                                            formName="Time" 
                                            placeholder="5:00 PM" 
                                            value={startTime}
                                            onChange={setStartTime}
                                            formDependencies={[setEndDate]}
                                            width={100}
                                            
                                        />
                                        <span className="w-3 border-b-2 border-foreground mb-10"></span>
                                        <FormField 
                                            placeholder="7:00 PM" 
                                            value={endTime}
                                            onChange={setEndTime}
                                            formDependencies={[setEndDate]}
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
                                // width={150}
                            />
                            { category == "tournament" &&
                                <FormSingleSelect 
                                    formName="Tournament Type" 
                                    required={true}
                                    selected={eventType}
                                    onChange={setEventType}
                                    options={[
                                        {label: "Regional", value: "regional"},
                                        {label: "State", value: "State"},
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
                                formName="Event Details" 
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
                                <FormField 
                                    formName="Registration Deadline"
                                    required={isTentative ? false: true}
                                    placeholder="01/28/2025" 
                                    value={registrationDeadline}
                                    onChange={setRegistrationDeadline}
                                    width={150}
                                />
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
                                <div onClick={ () => setAutoOpenRSVP(prev => !prev) } className="flex items-center gap-2 w-fit group hover:cursor-pointer ">
                                    <div className="w-[15px] h-[15px] outline-1 outline-muted-1 flex items-center justify-center group-hover:outline-primary">
                                        {autoOpenRSVP && <SelectCheckIcon className="text-[0.5rem] text-foreground"/>}
                                    </div>
                                    <div className={`text-[0.825rem] select-none ${ autoOpenRSVP ? "text-foreground" : "text-foreground/50 line-through" }`}>
                                        Automatically open RSVP
                                    </div>
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