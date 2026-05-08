import { PropsWithChildren } from 'react';

import { TokenUserContext } from '.';

import { useMe } from '../../hooks/use-me';

export const TokenUserProvider = ({ children }: PropsWithChildren) => {
  const value = useMe('token');

  return <TokenUserContext.Provider value={value}>{children}</TokenUserContext.Provider>;
};
