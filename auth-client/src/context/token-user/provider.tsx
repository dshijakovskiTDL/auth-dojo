import { PropsWithChildren } from 'react';

import { TokenUserContext } from '.';
import { useMeToken } from './useMe';

export const TokenUserProvider = ({ children }: PropsWithChildren) => {
  const value = useMeToken();

  return <TokenUserContext.Provider value={value}>{children}</TokenUserContext.Provider>;
};
