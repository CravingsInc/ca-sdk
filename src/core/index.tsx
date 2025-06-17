import React, { ReactNode, useEffect } from 'react';

import { SessionProvider } from '../context/SessionProvider';
import { PageTrackerProvider } from '../context/PageTrackerProvider';
import { LocationOptions } from '../types/Location';
import { Utility } from './Utility';

type Props = {
  children: ReactNode;
  platform?: string;
  locationApi?: LocationOptions;
  allowLogger?: boolean;
};

const defaultLocationApi: LocationOptions = {
  type: 'custom',
  api: "https://geolocation-db.com/json"
}

export const CASDK: React.FC<Props> = ({ platform, children, locationApi, allowLogger }) => {
  useEffect(() => {
    Utility.Logger.info("CASDK tracking initialized");
    // Setup logic here (e.g. session ID, socket connection)
  }, []);

  useEffect( () => {
    Utility.PLATFORM = platform || "CravingsInc";
    Utility.Location.setLocationApi( locationApi || defaultLocationApi );
    Utility.Logger.setAllowConsole( allowLogger || true );

  }, [ locationApi, allowLogger, platform ])

  return (
    <SessionProvider>
      <PageTrackerProvider>
        {children}
      </PageTrackerProvider>
    </SessionProvider>
  );
};
