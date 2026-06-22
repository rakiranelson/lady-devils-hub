import Link from "next/link";

type Props = {
    title: string;
    href: string;
    color: string;
};

export default function MoreDetails({ title = "MoreDetails", href = "", color} : Props) {  
    return (

        <Link href={`${ href }`} className={`rounded-[3.2px] p-1.5 text-${ color } hover:text-foreground transition-all`}> 
            { title } 
        </Link>
    )
};
