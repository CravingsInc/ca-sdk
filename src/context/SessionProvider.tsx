import React, { createContext } from "react";

import { SessionManager } from "../core/session";

type SessionProviderProps = {
    userId?: string;
    platform: string;
    children: React.ReactNode;
}

export const SessionContext = createContext<ReturnType< typeof SessionManager.useSessionsManager > | undefined>(undefined);

export const SessionProvider: React.FC<SessionProviderProps> = ({ userId, platform, children }) => {
    const ctx = SessionManager.useSessionsManager( userId );

    console.log( ctx )

    return (
        <SessionContext.Provider value={ctx}>
            {children}
        </SessionContext.Provider>
    )

}
