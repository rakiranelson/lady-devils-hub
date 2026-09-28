type ToggleProps = {
    toggle: boolean;
    onChange: (on: boolean) => void;
    size?: number;
}
export default function FormToggle({ toggle = false, onChange, size = 12 }: ToggleProps) {
    const handleToggle = () => {
        onChange(!toggle)
    };
    
    return (
        <div onClick={handleToggle} 
        className={` p-[2px] rounded-[30px] flex flex-none items-center border-1 hover:cursor-pointer h-fit ${ toggle ? "bg-card border-primary" : "bg-background/30 border-muted-1/70"} `}
        style={{ width: size * 2.5 + 6 }}>
            <div 
                className={` rounded-full transition-all duration-100 ${toggle ? "bg-primary" : "bg-muted-1/70" }`}
                style={{
                    width: size, 
                    height: size, 
                    marginLeft: toggle ? `calc(100% - ${size}px)` : 0
                }}
            /> 
        </div>
    )
};
