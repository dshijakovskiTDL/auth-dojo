import { createContext, useContext } from 'react';

import { useMeSession } from './useMe';

export type SessionUser = { email: string; userId: string };

type SessionContextType = ReturnType<typeof useMeSession>;
export const SessionContext = createContext<SessionContextType | null>(null);

export const useSessionUser = () => {
  const value = useContext(SessionContext);

  if (value === null) {
    throw new Error('Please add a SessionUserProvider!');
  }

  return value;
};
