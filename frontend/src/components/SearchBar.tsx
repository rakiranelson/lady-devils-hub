"use client";

import useDebounce from "@/hooks/useDebounce";
import { useState, useEffect } from "react";
import SearchIcon from "@/assets/icons/search.svg";

type SearchBarProps = {
    // question mark is here for now but will be removed
    onSearch: (query: string) => void;
    placeholder?: string;
};

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
    const delay = 500;
    const [inputValue, setInputValue] = useState("");
    const debouncedValue = useDebounce(inputValue, delay);

    // handles search debounce
    useEffect(() => {
        onSearch(debouncedValue)
    }, [debouncedValue]);

    // if  users press enter
    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch(inputValue);
        }
    };

    return (
        <div className="bg-primary-light/15 hover:bg-primary-light/18 flex-1 min-w-[200px] max-w-[400px] h-10 inline-flex items-center rounded-[30px] px-3 gap-2 outline-2 outline-transparent focus-within:outline-primary focus-within:!bg-primary-light/15 transition-all">
            <SearchIcon className="text-foreground/20 mb-0.5 text-[1.3rem]"/>
            <input 
                value={ inputValue }
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={ handleEnter }
                placeholder={ placeholder }
                className="placeholder:text-foreground/15 font-medium outline-none flex-1 bg-transparent text-lg"
            />
        </div>
    )
};