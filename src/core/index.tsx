import React, { ReactNode, useEffect } from 'react';

import { SessionProvider } from '../context/SessionProvider';
import { PageTrackerProvider } from '../context/PageTrackerProvider';

type Props = {
  children: ReactNode;
};

export const CASDK: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    console.log("CASDK tracking initialized");
    // Setup logic here (e.g. session ID, socket connection)
  }, []);

  return (
    <SessionProvider>
      <PageTrackerProvider>
        {children}
      </PageTrackerProvider>
    </SessionProvider>
  );
};
