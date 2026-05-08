import { PropsWithChildren } from 'react';

import { SessionContext } from '.';

import { useMe } from '../../hooks/use-me';

const SessionUserProvider = ({ children }: PropsWithChildren) => {
  const value = useMe('session');

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export default SessionUserProvider;
