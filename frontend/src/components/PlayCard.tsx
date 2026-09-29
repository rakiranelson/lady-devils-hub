import Image from "next/image";

export type PlayProps = {
    id: number;
    playName: string;
    playNumber: number |null;
    playType?: string;
    thumbnail_url: string;
    animation_url: string | null;
};

export function PlayCard({ playStyling="", ...play }: PlayProps & { playStyling?: string }) {  
    return (
        <div className={` ${ playStyling } aspect-[300/200] flex flex-col text-sm bg-foreground rounded-[18px] overflow-hidden relative group hover:cursor-pointer duration-300 `}>

            <div className="w-full h-full overflow-hidden absolute">
                <Image
                    className="object-cover object-[50%_50%] group-hover:scale-108 transition-transform duration-350"
                    src={ play.thumbnail_url }
                    alt="Play Thumbnail"
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

