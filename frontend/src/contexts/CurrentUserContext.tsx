"use client";
import { createContext } from "react";

type User = {
    id: number;
    exec: boolean;
};

export const UserContext = createContext<User | null>(null); 

// run a query to get the current user
const currentUser: User = {
    id: 1,
    exec: true
};

export default function CurrentUserProvider(
    { children }: { children: React.ReactNode }) {

    return (
        <UserContext.Provider value={currentUser}>
            { children }
        </UserContext.Provider>
    );
};

