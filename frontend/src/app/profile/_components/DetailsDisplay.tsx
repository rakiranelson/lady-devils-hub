
export type DisplayProps = {
    label: string;
    info: string;
};

export function DetailsDisplay({ label, info }: DisplayProps) {
    return (
        <div>
            <div className="font-semibold text-lg">
                { label }
            </div>
            <div className="-mt-1">
                { info }
            </div>
        </div>
    )
};