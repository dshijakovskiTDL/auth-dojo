import { createContext, useContext } from 'react';

import { useMe } from '../../hooks/use-me';

type SessionContextType = ReturnType<typeof useMe>;
export const SessionContext = createContext<SessionContextType | null>(null);

export const useSessionUser = () => {
  const value = useContext(SessionContext);

  if (value === null) {
    throw new Error('Please add a SessionUserProvider!');
  }

  return value;
};
