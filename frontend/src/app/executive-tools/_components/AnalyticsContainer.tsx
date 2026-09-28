
import ToolCard from "./ToolCard";

import PercentIcon from "@/assets/icons/percent.svg";
import DonutChartIcon from "@/assets/icons/donutChart.svg";
import IncreaseGrowthIcon from "@/assets/icons/increaseGrowth.svg";

export default function AnalyticsContainer() {
    return (
        <div>
            <div className="flex items-center gap-3">
                
                <span className="text-2xl font-semibold">Team Analytics</span>
            </div>

            <div className="grid grid-cols-4 gap-x-4 gap-y-3 px-1 mt-2">
                <ToolCard 
                    icon={ <PercentIcon className="text-foreground text-[2.25rem]" strokeWidth={5}/>}
                    name="Attendance"
                    description="Attendance trends and participation rates for practices during the season."
                    analytics={true}
                    actionHref="/"
                />
                <ToolCard 
                    icon={ <DonutChartIcon className="text-foreground text-[2.25rem]" strokeWidth={7}/>}
                    name="Member Stats"
                    description="Explore member demographics and team composition."
                    analytics={true}
                    actionHref="/"
                />
                <ToolCard 
                    icon={ <IncreaseGrowthIcon className="text-foreground text-[2.25rem]" strokeWidth={4}/>}
                    name="Club Growth"
                    description="Track changes in club membership and retention over time."
                    analytics={true}
                    actionHref="/"
                />

            </div>
        </div>
    )
};