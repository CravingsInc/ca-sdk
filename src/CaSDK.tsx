import React, { ReactNode, useEffect } from 'react';

type Props = {
  children: ReactNode;
};

export const CASDK: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    console.log("CASDK tracking initialized");
    // Setup logic here (e.g. session ID, socket connection)
  }, []);

  return <>{children}</>;
};
