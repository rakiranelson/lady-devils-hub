"use client";
import { createContext } from "react";


export const SemesterContext = createContext<string>(""); 

// run a query to get the current semester
const currentSemester = "Fall 2026"

export default function SemesterProvider(
    { children }: { children: React.ReactNode }) {

    return (
        <SemesterContext.Provider value={currentSemester}>
            { children }
        </SemesterContext.Provider>
    );
};

