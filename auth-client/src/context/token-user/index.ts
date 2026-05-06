import { createContext, useContext } from 'react';
import { useMeToken } from './useMe';

export type TokenUser = { email: string; userId: string };

type TokenUserCtx = ReturnType<typeof useMeToken>;
export const TokenUserContext = createContext<TokenUserCtx | null>(null);

export const useTokenUser = () => {
  const value = useContext(TokenUserContext);

  if (value === null) {
    throw new Error('Please add a TokenUserProvider!');
  }

  return value;
};
