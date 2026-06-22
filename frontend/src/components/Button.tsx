
type ButtonProps = {
    title: string;
    width: number;
    height: number;
    isEdit: boolean;
};


export default function Button({ title = "PUSH ME!", width = 85, height = 28, isEdit = false} : ButtonProps) {  
    return (

        <button className={`${ !isEdit ? "bg-primary" : "bg-muted-2" } rounded-[3.2px] p-1.5 hover:bg-[hsl(242,73%,45%)] hover:shadow-button transition-all`} style={{ width: `min(${width}px, 13vw)`, height: height}}> { title } </button>
    )
};
