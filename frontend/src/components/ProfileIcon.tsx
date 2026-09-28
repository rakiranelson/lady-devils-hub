import Link from "next/link";

export type ProfileIconProps = {
    initials: string;
    size: number;
};

export default function ProfileIcon({ initials, size }: ProfileIconProps) {
    return (
        <Link href="/profile">
            <span className="bg-primary flex items-center rounded-full justify-center text-xl hover:bg-[hsl(242,73%,52%)] hover:shadow-profile" style={{ width: size, height: size}}>
                { initials }
            </span>
        </Link>
    );
};