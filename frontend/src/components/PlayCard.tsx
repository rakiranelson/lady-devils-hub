import Image from "next/image";

export type PlayProps = {
    id: number;
    playName: string;
    playNumber: number |null;
    thumbnail_url: string;
    animation_url: string | null;
};


export function PlayCard(play : PlayProps) {  
    return (
        <div className="min-w-[180px] sm:min-w-[220px] md:min-w-[240px] max-w-[260px] [@media(min-width:53.125rem)_and_(max-height:43.9rem)]:h-34 aspect-[300/200] flex flex-col text-sm bg-foreground rounded-[18px] snap-start overflow-hidden relative group hover:cursor-pointer duration-300">

            <div className="w-full h-full overflow-hidden absolute">
                <Image
                    className="object-cover object-[50%_50%] group-hover:scale-108 transition-transform duration-350"
                    src={ play.thumbnail_url }
                    alt="Practice Banner"
                    fill={ true }
                    priority
                />
            </div>

            <div className="w-full absolute bottom-0 bg-card/70 p-2 pl-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                { play.playNumber } - { play.playName }
            </div>
        </div>
    );
};

export function PlayDetails(play : PlayProps) {
    return (
        <div className="w-full flex gap-2">


        </div>
    );
};

