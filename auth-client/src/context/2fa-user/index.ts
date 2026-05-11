import { createContext, useContext } from 'react';

import { useMe } from '../../hooks/use-me';

type TwoFactorUserCtx = ReturnType<typeof useMe>;
export const TwoFactorUserContext = createContext<TwoFactorUserCtx | null>(null);

export const useTwoFactorUser = () => {
  const value = useContext(TwoFactorUserContext);

  if (value === null) {
    throw new Error('Please add a TwoFactorUserProvider!');
  }

  return value;
};
