import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import BackIcon from "@/assets/icons/back.svg";
import { ModalContext } from "@/contexts/ModalContext";

type Props = {
    title: string;
    color: string;
};

export default function GoBack({ title = "", color } : Props) {  
    const router = useRouter();
    const isModal = useContext(ModalContext);

    const handleBackNavigation = () => {
        isModal ? router.back() : router.push("/events");
    };

    return (
        <div className={` rounded-[3.2px] text-${ color } hover:text-foreground transition-all hover:cursor-pointer`} onClick={ handleBackNavigation }> 

            <span className="mr-1">{ title }</span>
            <BackIcon className="inline text-[1.1rem] mb-0.5"/>
        </div>
    )
};
