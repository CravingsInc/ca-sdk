import React, { createContext } from "react";
import { usePageTracker } from "../hooks/usePage";
import { Utility } from "../core/Utility";

type PageTrackerProviderProps = {
    children: React.ReactNode;
}

export const PageTrackerContext = createContext<ReturnType< typeof usePageTracker > | undefined>(undefined);

export const PageTrackerProvider: React.FC<PageTrackerProviderProps> = ({children }) => {
    const ctx = usePageTracker();

    Utility.Logger.debug( "PageTrackerProvider", ctx );

    return (
        <PageTrackerContext.Provider value={ctx}>
            {children}
        </PageTrackerContext.Provider>
    )
}
