import React, { ReactNode, useEffect } from 'react';

import { SessionProvider } from '../context/SessionProvider';
import { PageTrackerProvider } from '../context/PageTrackerProvider';

type Props = {
  children: ReactNode;
  platform?: string;
  locationApi?: string;
};

export const CASDK: React.FC<Props> = ({ platform, children, locationApi }) => {
  useEffect(() => {
    console.log("CASDK tracking initialized");
    // Setup logic here (e.g. session ID, socket connection)
  }, []);

  return (
    <SessionProvider platform={ platform || "CravingsInc"} locationApi={locationApi || "https://geolocation-db.com/json"}>
      <PageTrackerProvider platform={ platform || "CravingsInc"}>
        {children}
      </PageTrackerProvider>
    </SessionProvider>
  );
};
