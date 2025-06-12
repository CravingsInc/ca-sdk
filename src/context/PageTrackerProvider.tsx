import React, { createContext } from "react";
import { usePageTracker } from "../hooks/usePage";

type PageTrackerProviderProps = {
    children: React.ReactNode;
    platform: string;
}

export const PageTrackerContext = createContext<ReturnType< typeof usePageTracker > | undefined>(undefined);

export const PageTrackerProvider: React.FC<PageTrackerProviderProps> = ({ platform, children }) => {
    const ctx = usePageTracker(platform);

    console.log( ctx );

    return (
        <PageTrackerContext.Provider value={ctx}>
            {children}
        </PageTrackerContext.Provider>
    )
}
