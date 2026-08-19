 
import { RosterMember } from "./RosterTable";
import { PositionChip } from "@/components/PositionChip";
import { chipColors } from "@/lib/chipColors";

export default function RosterRow(member: RosterMember) {
    return (
        <div className="contents group">
            <div className="bg-card/75 min-h-14 p-2 px-3 flex items-center text-[1.05rem] font-regular border-b-2 border-b-muted-1/20 justify-center group-hover:bg-primary/40 cursor-default">
                { member.jersey }
            </div>

            <div className="bg-card/75 p-2 px-3 flex items-center text-[1.05rem] font-semibold border-b-2 border-b-muted-1/20 group-hover:bg-primary/40 group-hover:cursor-pointer tracking-wider">
                { member.fullName }
            </div>

            <div className="bg-card/75 p-2 px-3 flex items-center text-[1.05rem] font-regular border-b-2 border-b-muted-1/20 gap-2 group-hover:bg-primary/40 select-none">
                { member.positions.map((position, index) => (
                    <PositionChip key={ position.full } abbrev={ position.abbrev } full={ position.full } color={ chipColors[index % chipColors.length] }/>
                ))}
            </div>

            <div className="bg-card/75 p-2 px-3 flex items-center text-[1.05rem] font-regular border-b-2 border-b-muted-1/20 justify-center group-hover:bg-primary/40 cursor-default">
                { member.joined }
            </div>
        </div>
    )
};