 
import { RosterMember } from "./RosterTable";
import { PositionChip } from "@/components/PositionChip";
import { chipColors } from "@/lib/chipColors";

export default function RosterRow(member: RosterMember) {
    return (
        <div className="contents group">
            <div className="bg-navigation min-h-15 p-2 px-3 flex items-center text-lg font-medium border-b-1 border-b-muted-1 justify-center group-hover:bg-muted-1/50 cursor-default">
                { member.jersey }
            </div>

            <div className="bg-navigation p-2 px-3 flex items-center text-lg font-bold border-b-1 border-b-muted-1 group-hover:bg-muted-1/50 group-hover:cursor-pointer">
                { member.fullName }
            </div>

            <div className="bg-navigation p-2 px-3 flex items-center text-lg font-medium border-b-1 border-b-muted-1 gap-2 group-hover:bg-muted-1/50 select-none">
                { member.positions.map((position, index) => (
                    <PositionChip key={ position.full } abbrev={ position.abbrev } full={ position.full } color={ chipColors[index % chipColors.length] }/>
                ))}
            </div>

            <div className="bg-navigation p-2 px-3 flex items-center text-lg font-medium border-b-1 border-b-muted-1 justify-center group-hover:bg-muted-1/50 cursor-default">
                { member.joined }
            </div>
        </div>
    )
};