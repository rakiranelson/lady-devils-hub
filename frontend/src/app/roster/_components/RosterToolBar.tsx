import SearchBar from "@/components/SearchBar";
import SeasonFilter from "./SeasonFilter";
import StatusPill from "@/components/StatusPill";

type ToolBarProps = {
    selectedSeason: string;
    setSelectedSeason: (season: string) => void;
};

export default function RosterToolBar({ selectedSeason, setSelectedSeason }: ToolBarProps) {

    // fetch seasons here
    const seasons: string[] = ["Spring 2027", "Fall 2026", "Spring 2026", "Fall 2025", "Spring 2025", "Fall 2024"]

    const onSearch = () => { return null };

    // fetch status info
    const members = "17 Active Members";

    return (
        <div className="py-3 overflow-visible flex gap-x-5 items-center flex-wrap">
            <SeasonFilter season={ selectedSeason } onChange={ setSelectedSeason } seasons={ seasons }/>
            <SearchBar onSearch={ onSearch } placeholder="Search members..."/>
            <StatusPill display={ members }/>
        </div>
    )
};