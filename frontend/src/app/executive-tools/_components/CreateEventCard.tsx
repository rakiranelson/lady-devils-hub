"use client";

import { useState, useLayoutEffect } from "react";
import FormField from "@/components/events/FormField";
import Button from "@/components/Button";
import FormMultiSelect from "@/components/events/FormMultiSelect";

export default function CreateEventCard() {
    const [page, setPage] = useState(1);

    // onclick needs to set state and render the correct parts of the form by submitting to backend and getting a specialized state

    const fetchNextPage = 2;
    const isTournament = true;

    return (
        <div className="aspect-[6/7] h-[650px] bg-navigation rounded-[10px] shadow-both-sides flex flex-col">
            <div className="bg-background/45 font-semibold text-2xl py-[10px] flex justify-center">
                Create Event
            </div>

            { page === 1 && (
                <div className="flex-1 flex flex-col mx-10 py-5">
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
                        <FormField 
                            formName="Category" 
                            placeholder="" 
                            required={true}
                            width={150}
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

                    <div className="mt-auto mb-1 flex gap-5 items-center text-lg">
                        <button onClick={ () => setPage(fetchNextPage) } className={`flex-1 font-semibold rounded-[3.5px] p-[6px] bg-muted-1 hover:bg-[hsl(242,73%,52%)] hover:shadow-button hover:cursor-pointer transition-all`}>Next</button>
                        <button className="h-full flex px-3 items-center underline text-muted-1 hover:cursor-pointer hover:text-foreground">Cancel</button>
                    </div>
                    
                </div>    
            )}

            { page === 2 && (
                <div className="flex-1 flex flex-col mx-10 py-5">
                    <div className="flex flex-col gap-4 pb-5 border-b-1 border-muted-1/30 h-[375px]">
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

                    <div className="flex flex-col gap-3 mt-4 py-3">
                        
                    </div>

                    <div className="mt-auto mb-1 flex gap-5 items-center text-lg">
                        <button onClick={ () => setPage(fetchNextPage) } className={`flex-1 font-semibold rounded-[3.5px] p-[6px] bg-muted-1 hover:bg-[hsl(242,73%,52%)] hover:shadow-button hover:cursor-pointer transition-all`}>Next</button>
                        <button className="h-full flex px-3 items-center underline text-muted-1 hover:cursor-pointer hover:text-foreground">Cancel</button>
                    </div>
                    
                </div>    
            )}

            
            

        </div>
    )
};