type FormCardProps = {
    children: React.ReactNode;
    cardTitle: string
}
export default function FormCard({ children, cardTitle }: FormCardProps) {

    return (
        <div className="aspect-[6/7] h-[650px] bg-navigation rounded-[10px] shadow-both-sides flex flex-col">
            <div className="bg-background/45 font-semibold text-2xl py-[10px] flex justify-center select-none">
                { cardTitle }
            </div>

            <div className="flex-1 flex flex-col mx-10 py-5">
                { children }
            </div>    
        </div>
    )
};