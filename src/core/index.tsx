import React, { ReactNode, useEffect } from 'react';

import { SessionProvider } from '../context/SessionProvider';
import { PageTrackerProvider } from '../context/PageTrackerProvider';

type Props = {
  children: ReactNode;
  platform?: string;
};

export const CASDK: React.FC<Props> = ({ platform, children }) => {
  useEffect(() => {
    console.log("CASDK tracking initialized");
    // Setup logic here (e.g. session ID, socket connection)
  }, []);

  return (
    <SessionProvider platform={ platform || "CravingsInc"}>
      <PageTrackerProvider platform={ platform || "CravingsInc"}>
        {children}
      </PageTrackerProvider>
    </SessionProvider>
  );
};
