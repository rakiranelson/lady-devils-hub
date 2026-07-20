import Link from "next/link";
import OpenPageIcon from "@/assets/icons/openPage.svg";

type Props = {
    title: string;
    href: string;
    color: string;
};

export default function MoreDetails({ title = "MoreDetails", href = "", color } : Props) {  
    return (
        <Link href={`${ href }`} className={` rounded-[3.2px] text-${ color } hover:text-foreground transition-all `}> 

            <span className="mr-1">{ title }</span>
            <OpenPageIcon className="inline text-[0.6rem] mb-0.5"/>
        </Link>
    )
};
