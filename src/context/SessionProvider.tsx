import React, { createContext } from "react";

import { SessionManager } from "../core/session";
import { LocationOptions } from "../types/Location";
import { Utility } from "../core/Utility";

type SessionProviderProps = {
    userId?: string;
    children: React.ReactNode;
}

export const SessionContext = createContext<ReturnType< typeof SessionManager.useSessionsManager > | undefined>(undefined);

export const SessionProvider: React.FC<SessionProviderProps> = ({ userId, children }) => {
    const ctx = SessionManager.useSessionsManager( userId );

    Utility.Logger.debug( "SessionManager", ctx )

    return (
        <SessionContext.Provider value={ctx}>
            {children}
        </SessionContext.Provider>
    )

}
