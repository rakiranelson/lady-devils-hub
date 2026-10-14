import SelectCheckIcon from "@/assets/icons/selectCheck.svg";

type CheckboxProps = {
    check: boolean;
    onChange: (on: boolean) => void;
    text: string;
}

export default function Checkbox({ check = false, onChange, text}: CheckboxProps) {
    const handleClick = () => {
        onChange(!check)
    };
    
    return (
        <div onClick={handleClick} className="flex items-center gap-2 w-fit group hover:cursor-pointer">
            <div className={` w-[15px] h-[15px] outline-1 ${ check ? "outline-muted-1" : "outline-muted-1/50"} outline-muted-1 flex items-center justify-center group-hover:outline-2 group-hover:outline-primary `}>
                {check && <SelectCheckIcon className="text-[0.5rem] text-foreground"/>}
            </div>
            <div className={` select-none ${ check ? "text-foreground" : "text-foreground/30" }`}>
                {text}
            </div>
        </div>
    )
};
