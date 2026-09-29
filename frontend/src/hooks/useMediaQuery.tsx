"use client";

import { useState, useEffect } from "react";

export default function useMediaQuery(query: string) {

    const [isMatch, setIsMatch] = useState<boolean | null>(null);

    useEffect(() => {
        const media = window.matchMedia(query);
        setIsMatch(media.matches);

        const listener = (e: MediaQueryListEvent) => {
            setIsMatch(e.matches);
        };

        media.addEventListener("change", listener);

        return () => {
            media.removeEventListener("change", listener);
        };
        
    }, [query]);

    return isMatch;
};