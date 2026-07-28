"use client";

import {  useRef, useState, useEffect, DependencyList } from "react";

export default function useScrollFade<T extends HTMLElement>(deps: DependencyList = [], horizontal: boolean = false) {
    const scrollContainer = useRef<T>(null);
    const contentContainer= useRef<T>(null)
    const [showFade, setShowFade] = useState(false);

    const updateFade = () => {

        if (scrollContainer.current) {
            const buffer = 1

            if (horizontal) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
                setShowFade(scrollLeft + clientWidth < scrollWidth - buffer);
            } else {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer.current;
                setShowFade(scrollTop + clientHeight < scrollHeight - buffer);
            }
    
        }
    };

    useEffect(() => {
        updateFade();

        const observer = new ResizeObserver(updateFade);

        if (scrollContainer.current) {
            observer.observe(scrollContainer.current);
        }

        if (contentContainer.current) {
            observer.observe(contentContainer.current);
        }

        return () => observer.disconnect();
    }, deps);

    const handleScroll = () => {
        updateFade();
    };

    return { scrollContainer, contentContainer, showFade, handleScroll };
};