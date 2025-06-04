import React, { ReactNode, useEffect } from 'react';
import { SessionManager } from './session';

type Props = {
  children: ReactNode;
};

export const CASDK: React.FC<Props> = ({ children }) => {

    const { sessions } = SessionManager.useSessions();

    useEffect(() => {
        console.log("CASDK tracking initialized");
        console.log( sessions )
        // Setup logic here (e.g. session ID, socket connection)
    }, []);

  return <>{children}</>;
};
