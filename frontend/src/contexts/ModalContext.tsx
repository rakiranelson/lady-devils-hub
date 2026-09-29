"use client";

import { createContext } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

export const ModalContext = createContext(false);

export default function ModalProvider(
    { children }: { children: React.ReactNode }) {
    
    const modalSegments = useSelectedLayoutSegment("modal");
    const isModal = modalSegments != null && modalSegments.length > 0 && modalSegments[0] !== "__DEFAULT__";

    return (
        <ModalContext.Provider value={isModal}>
            { children }
        </ModalContext.Provider>
    );
};