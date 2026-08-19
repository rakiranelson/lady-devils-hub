"use client";

import { useState, useRef, useContext, useLayoutEffect} from "react";
import { UserContext } from "@/contexts/CurrentUserContext";
import DropDownIcon from "@/assets/icons/dropDown.svg";
import useScrollFade from "@/hooks/useScrollFade";
import RVSPTable from "./RSVPTable";

type props = {
    label: string;
    handleRSVPOpen: () => void;
    handleRSVPClose: () => void;
    pageScrollRef: React.RefObject<HTMLDivElement | null>,
    maxHeight: number | null;
};

type member = {
    id: number;
    name: string
}

type PlayerView = {
    yes?: member[];
    maybe?: member[]
};

type ExecView = PlayerView & {
    no?: member[],
    pending?: member[],
};

export type responses = PlayerView | ExecView;

export function RVSPList({ label, handleRSVPOpen, handleRSVPClose, pageScrollRef, maxHeight }: props) {

    const isExec = useContext(UserContext)?.exec;
    // const isExecView = (event: responses) => "noGoing" in event;

    const [isOpen, setIsOpen] = useState(false);

    const handleDisplay = () => {
        if (isOpen) {
            handleRSVPClose();
        } else {
            handleRSVPOpen()
        }

        setIsOpen((prev) => !prev)
    };

    useLayoutEffect(() => {
        if (isOpen && pageScrollRef.current) {
            pageScrollRef.current.scrollTo({
                top: pageScrollRef.current.scrollHeight,
                behavior: "smooth",
            })
        }
    }, [isOpen])

    // fetch the responses
    const rsvp: responses = {
        yes: [{id: 1, name: "Anita Maxwynn"}, {id: 2, name:"Ra'Kira Nelson"}, {id: 3, name: "Akeela and the Bee"}, {id: 4, name: "Anita Maxwynn 2.0"}, {id: 5, name: "Bobby Builder"}, {id: 6, name: "Someone Else"}, {id: 7, name: "Bobby Builder"}, {id: 8, name: "Jose Martinez"}],
        maybe: [{id: 5, name: "Bobby Builder"}, {id: 9, name: "Someone Else"}, {id: 8, name: "Jose Martinez"}],
        no: [{id: 3, name: "Akeela and the Bee"}, {id: 8, name: "Jose Martinez"}, {id: 1, name: "Anita Maxwynn"}, {id: 2, name: "Ra'Kira Nelson"} ],
        pending: [{id: 10, name: "Nobody Greater"}, {id: 11, name: "I looked High and Low"}, {id: 12, name: "Didn't Find Nobody"}]
    };

    const total = Object.values(rsvp).reduce((sum, array) => sum + array.length, 0)

    return (
        <div className={` flex flex-col flex-none w-full`}>

            <div onClick={ handleDisplay } className={` inline-flex items-center px-3 gap-2 group hover:cursor-pointer select-none hover:font-medium ${ isOpen ? "h-[40px] sm:h-[45px] border-t border-muted-1 justify-center" : "" }`}>
                <span className="text-[min(1.1rem,2.75vw)] font-regular">{`${ isOpen ? "" : "View "}${ label } ${ isOpen ? `(${total})`: "" } `}</span>
                <DropDownIcon className={` text-[min(0.75rem,2vw)] text-foreground/75 group-hover:text-foreground ${ isOpen ? "rotate-180 mb-0.5" : "" } transition-transform duration-400`}/>
            </div>

            { isOpen && (
                    <div 
                        className="flex mx-auto bg-muted-1/20 border-1 border-muted-1/70 w-full rsvp-table:w-3/4 rounded-[8px] scrollbar-thin shadow-rsvp-table overflow-hidden"
                        style={{ height: maxHeight ?? 500 }}>
                        
                        <RVSPTable rsvp={ rsvp }/>
                        
                    </div>
            ) }
        </div>
    )

};