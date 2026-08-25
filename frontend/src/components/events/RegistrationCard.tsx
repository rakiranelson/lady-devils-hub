import Button from "../Button";

type CardProps = {
    response: string | null;
    registrationDeadline: string;
    deadlinePassed: boolean;
};

export default function RegistrationCard({ response, registrationDeadline, deadlinePassed }: CardProps) {

    const groupTransportation = true;
    const lodging = true;
    let transportationAssignment = null;
    let roomAssignment = null;

    if (groupTransportation) {
        // fetch response information, could be null if not responded yet
        transportationAssignment = "Ella's Car";
    };

    // change to const transportationAssignment = groupTransportation ? fetch(database) : null, so you don't have to use the let variable

    if (lodging) {
        // fetch response information
        roomAssignment = "Room 231";
    };

    return (
        <div className="self-start flex flex-col bg-muted-1/30 border-2 border-muted-1/45 rounded-[5px] shadow-small-card items-center text-base w-[275px] flex-none">

            <div className="border-b-2 border-muted-1/75 py-2 px-4 w-full flex justify-center">
                My Registration
            </div>

            <div className="flex flex-col px-3 py-2 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-muted-1/45">
                <div className="flex justify-between items-center py-3">
                    <div className={` leading-tight ${ deadlinePassed ? "text-foreground/70" : "text-warning" } `}>Register by { registrationDeadline }</div>

                    <div className="ml-auto">
                        { response === null ?  
                            (<Button title="Register" width={105}/>) : 
                            (<Button title="Edit Response" width={105} isEdit={true}/>) 
                        }
                    </div>
                </div>

                { groupTransportation && (
                    <div className="flex justify-between items-center py-3">

                        <div className="text-foreground/70 flex flex-col leading-tight">
                            <span>Transportation Assignment</span>
                            { transportationAssignment !== null ? 
                                (<span className="text-[1.05rem] font-medium text-success">{ transportationAssignment }</span>) : 
                                (<span></span>) }

                        </div>

                        <div className="ml-auto">
                            { transportationAssignment === null ?  
                                (<Button title="Submit Form" width={105}/>) : 
                                (<Button title="Edit" width={105} isEdit={true}/>) 
                            }
                        </div>
                    
                    </div>
                )}

                { lodging && (
                    <div className="flex justify-between items-center py-3">
                        
                        <div className="text-foreground/70 flex flex-col leading-tight">
                            <span>Room Assignment</span>
                            { roomAssignment !== null ? 
                                (<span className="text-[1.05rem] font-medium text-success">{ roomAssignment }</span>) : 
                                (<span></span>) }

                        </div>

                        <div className="ml-auto">
                            { roomAssignment === null ?  
                                (<Button title="Submit Form" width={105}/>) : 
                                (<Button title="Edit" width={105} isEdit={true}/>) 
                            }
                        </div>
                    
                    </div>
                )}
            </div>
            
        </div>
    )
};