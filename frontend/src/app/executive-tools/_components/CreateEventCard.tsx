"use client";

import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import FormCard from "./FormCard";
import FormField from "@/app/executive-tools/_components/FormField";
import FormMultiSelect from "@/app/executive-tools/_components/FormMultiSelect";
import FormSingleSelect from "./FormSingleSelect";
import NoticeIcon from "@/assets/icons/notice.svg";
import SelectCheckIcon from "@/assets/icons/selectCheck.svg";

export default function CreateEventCard() {
    const [page, setPage] = useState(1);
    const [prevPage, setPrevPage] = useState(0);
    const [autoOpenRSVP, setAutoOpenRSVP] = useState(true);
    const router = useRouter();

    // onclick needs to set state and render the correct parts of the form by submitting to backend and getting a specialized state

    const isTournament = true;
    const isTentative = false;

    const handleNext = () => {
        setPrevPage(page)
        setPage(page + 1); 
    };

    const handleBack = () => {
        setPage(prevPage)
        setPrevPage(prevPage - 1)
    };

    const handleCancel = () => {
        router.back();
        // get rid of temp event id
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
                        />
                        <div className="flex justify-between">
                            <FormField 
                                formName="Date" 
                                placeholder="01/01/2000" 
                                width={150}
                            />
                            <div className="flex gap-2">
                                <FormField 
                                    formName="Time" 
                                    placeholder="5:00 PM" 
                                    width={100}
                                />
                                <span className="w-3 border-b-2 border-foreground mb-4"></span>
                                <FormField 
                                    placeholder="7:00 PM" 
                                    width={100}
                                />
                            </div>
                        </div>
                        <FormSingleSelect 
                            formName="Category" 
                     
                            required={true}
                            // width={150}
                        />
                    </div>

                    <div className="mt-4 text-[1.1rem] font-medium">Location</div>

                    <div className="flex flex-col gap-3 py-3">
                        <FormField 
                            formName="Display Name" 
                            placeholder="e.g. Cohan Fields" 
                        />
                        <FormField 
                            formName="Address"
                            placeholder="e.g. 148 Frank Basset Dr, Durham, NC 27705" 
                        />
                    </div>

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
                            />
                        </div> 
                        
                        { isTournament && (
                            <div>
                                <FormMultiSelect formName="Does this tournament require any additional registration details?"/>
                            </div>
                            
                        )}
                    </div>

                    <div className="flex flex-col gap-3 py-3 mb-10">

                        { isTentative ?
                            <div className="bg-metadata/30 mt-2 rounded-[5px] flex items-center py-3 px-4 gap-x-5">
                        
                                <NoticeIcon className="text-[2.25rem] flex-none"/>
                                <span className="text-foreground/60 text-sm leading-snug">
                                    This event is missing a <span className="font-semibold underline">date</span> and/or <span className="font-semibold underline">location</span>. It will be saved as a <span className="font-semibold underline">tentative event</span> until the remaining details are added.
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

                        <button className={`flex-[2] font-semibold rounded-[3.5px] p-[6px] bg-primary hover:bg-[hsl(242,73%,52%)] hover:shadow-button hover:cursor-pointer transition-all`}>{ `Save as ${ isTentative ? "Tentative" : "Scheduled"} `}</button>

                        <button onClick={ handleCancel } className="h-full flex px-3 items-center underline text-muted-1 hover:cursor-pointer hover:text-foreground">Cancel</button>
                    </div>
                </>       
            )}
        </FormCard>

            

            
    )
};