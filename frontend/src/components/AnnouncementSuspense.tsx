
export default function AnnouncementSuspense({ count }: { count: number }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="border-b-2 border-b-muted-2/50 rounded-t-[5px] pl-3 sm:text-lg">
                Announcements
            </div>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="w-full h-4 rounded-[5px] bg-muted-1/50 animate-pulse" />
            ))}
        </div>
    )
};