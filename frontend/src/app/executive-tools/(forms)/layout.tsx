
export default function FormsLayout(
    { children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <div className="h-full flex flex-col">
            
            <div className="w-full max-w-[1050px] mx-auto px-5 pb-2 scrollbar-gutter-auto flex flex-col flex-1 min-h-0 relative">
                { children }
            </div>
        </div>
    )
};