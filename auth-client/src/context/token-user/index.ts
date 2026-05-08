import { createContext, useContext } from 'react';

import { useMe } from '../../hooks/use-me';

type TokenUserCtx = ReturnType<typeof useMe>;
export const TokenUserContext = createContext<TokenUserCtx | null>(null);

export const useTokenUser = () => {
  const value = useContext(TokenUserContext);

  if (value === null) {
    throw new Error('Please add a TokenUserProvider!');
  }

  return value;
};
