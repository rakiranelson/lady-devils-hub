
export type Position = {
    abbrev: string;
    full: string;
};
export type PositionChipProps = {
    abbrev: string;
    full: string,
    color: string
}
export function PositionChip({ abbrev, full, color }: PositionChipProps) {
    return (
        <div title={ full } className={`w-14 ${ color } rounded-[20px] flex justify-center px-1 font-medium hover:cursor-default `}>
            { abbrev }
        </div>
    )
};