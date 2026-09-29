type DisplayProps = {
    label: string;
    children: React.ReactNode;
};

export default function PlayerInfoRow({ label, children }: DisplayProps) {
    return (
        <div className="flex gap-5 items-center h-7.5">
            <span className="text-lg">{ label }</span>
            <span className="ml-auto text-lg font-semibold">{ children }</span>
        </div>
    )
};