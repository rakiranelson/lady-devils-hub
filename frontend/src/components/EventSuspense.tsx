
export default function EventSuspense({ count }: { count: number }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="aspect-[304/259] max-w-[304px] rounded-[18px] bg-card animate-pulse" />
            ))}
        </div>
    )
};