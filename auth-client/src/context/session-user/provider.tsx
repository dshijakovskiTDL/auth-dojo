import { PropsWithChildren } from 'react';

import { SessionContext } from '.';
import { useMeSession } from './useMe';

const SessionUserProvider = ({ children }: PropsWithChildren) => {
  const value = useMeSession();

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export default SessionUserProvider;
