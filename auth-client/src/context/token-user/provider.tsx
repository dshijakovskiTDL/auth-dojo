import { useMeToken } from './useMe';
import { TokenUserContext } from '.';
import { PropsWithChildren } from 'react';

export const TokenUserProvider = ({ children }: PropsWithChildren) => {
  const result = useMeToken();

  return (
    <TokenUserContext.Provider value={result}>
      {children}
    </TokenUserContext.Provider>
  );
};
