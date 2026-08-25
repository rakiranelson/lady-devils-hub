
type ButtonProps = {
    title?: string;
    width?: number;
    height?: number;
    isEdit?: boolean;
};


export default function Button({ title = "PUSH ME!", width = 85, height = 28, isEdit = false} : ButtonProps) {  
    return (

        <button className={`${ !isEdit ? "bg-primary" : "bg-primary-light/50" } rounded-[3.2px] p-1.5 hover:bg-[hsl(242,73%,52%)] hover:shadow-button flex justify-center items-center hover:cursor-pointer transition-all`} style={{ width: `min(${width}px, 14vw)`, height: height}}> { title } </button>
    )
};
