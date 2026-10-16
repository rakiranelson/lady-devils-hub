
import { PlayCard, PlayProps } from "@/components/PlayCard";
import PlaySuspense from "./PlaySuspense"


type PlayContainerProps = {
    plays: PlayProps[] | null; // remove the | null once we use suspense;
};

export function PlayContainer({ plays }: PlayContainerProps) {

    if (plays === null) {
        return <PlaySuspense/>
    };
                
    return (
        <div className="grid grid-cols-2 sm:max-large:grid-cols-3 large:grid-cols-4 p-1 gap-4 justify-between mt-2">

                { plays.length === 0 && (
                    <div className="pl-3 text-lg text-foreground/75">
                        No plays found.
                    </div>
                )}

                {plays.map((play) => {
                    return <PlayCard key={ play.id } { ...play } />;
                })}
                    
        </div>
    );
};
