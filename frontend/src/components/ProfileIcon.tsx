export type ProfileIconProps = {
    initials: string;
    size: number;
};

export default function ProfileIcon({ initials, size }: ProfileIconProps) {
    return (
        <span className="bg-primary flex items-center rounded-full justify-center text-xl" style={{ width: size, height: size}}>
            { initials }
        </span>
    );
};