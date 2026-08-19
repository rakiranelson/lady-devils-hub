
import { Position } from "@/components/PositionChip";
import RosterRow from "./RosterRow";

export type RosterMember = {
    id: number;
    jersey: string;
    fullName: string;
    positions: Position[];
    joined: string;
};

type Roster = RosterMember[];

type RosterTableProps = {
    season: string;
    // search: string;
    ref?: React.Ref<HTMLDivElement>
};

// export function RosterTable({ season, search }: RosterTableProps) {
export function RosterTable({ season }: RosterTableProps) {

    // fetch roster
    const roster: Roster = [
        {
            id: 1,
            jersey: "08",
            fullName: "Anita Maxwynn",
            positions: [
                { abbrev: "C", full: "Center" },
                { abbrev: "LB", full: "Linebacker" }, 
                { abbrev: "WR", full: "Wide Receiver" },
                { abbrev: "RB", full: "Running Back" }
            ],
            joined: "Fall 2025",
        },
        {
            id: 2,
            jersey: "42",
            fullName: "Ben Dover",
            positions: [
                { abbrev: "QB", full: "Quarterback" },
                { abbrev: "LB", full: "Linebacker" }, 
            ],
            joined: "Spring 2024",
        },
        {
            id: 3,
            jersey: "17",
            fullName: "First Last Name",
            positions: [
                { abbrev: "WR", full: "Wide Receiver" },
                { abbrev: "SS", full: "Safety" }, 
            ],
            joined: "Fall 2024",
        },
        {
            id: 4,
            jersey: "—",
            fullName: "Shewas Afairy",
            positions: [
                { abbrev: "—", full: "" },
            ],
            joined: "Fall 2026",
        },
        {
            id: 5,
            jersey: "27",
            fullName: "Justin Bieber",
            positions: [
                { abbrev: "CB", full: "Cornerback" },
                { abbrev: "RB", full: "Running Back" }, 
            ],
            joined: "Fall 2024",
        },
        {
            id: 6,
            jersey: "01",
            fullName: "Hidden Valley RAAAAAANCH!",
            positions: [
                { abbrev: "WR", full: "Wide Receiver" },
                { abbrev: "CB", full: "Cornerback" }, 
            ],
            joined: "Fall 2025",
        },
        {
            id: 7,
            jersey: "11",
            fullName: "Deez Nuts",
            positions: [
                { abbrev: "—", full: "" },
            ],
            joined: "Spring 2025",
        },
        {
            id: 8,
            jersey: "—",
            fullName: "idk gang",
            positions: [
                { abbrev: "—", full: "" },
            ],
            joined: "Fall 2026",
        },
        {
            id: 9,
            jersey: "—",
            fullName: "overflow test 1",
            positions: [
                { abbrev: "—", full: "" },
            ],
            joined: "Fall 2026",
        },
    ];


    return (

        <div className="mt-1 grid grid-cols-[90px_minmax(max-content,3fr)_minmax(max-content,2fr)_135px] gap-x-1 relative [&>*:last-child>*:first-child]:rounded-bl-[10px] [&>*:last-child>*:last-child]:rounded-br-[10px] [&>*:last-child>*]:border-b-0" >

            <div className="sticky top-0 z-5 bg-background col-start-1 col-end-[-1] row-start-1"/>
            
            <>
                <div className="bg-metadata-trans min-h-13 p-2 px-3 flex items-end text-lg font-semibold rounded-tl-[10px] sticky top-0 z-10 select-none row-start-1 col-start-1">Jersey #</div>
                <div className="bg-metadata-trans p-2 px-3 flex items-end text-lg font-semibold sticky top-0 z-10  select-none row-start-1 col-start-2">Name</div>
                <div className="bg-metadata-trans p-2 px-3 flex items-end text-lg font-semibold sticky top-0 z-10  select-none row-start-1 col-start-3">Preferred Positions</div>
                <div className="bg-metadata-trans p-2 px-3 flex items-end text-lg font-semibold rounded-tr-[10px] sticky top-0 z-10 select-none row-start-1 col-start-4">Member Since</div>
            </>

            <>
                { roster.map((member) => (
                    <RosterRow key={ member.id } { ...member }/>
                ))}
            </>
        </div>
        
    )
};