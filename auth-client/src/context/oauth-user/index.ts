import { createContext, useContext } from 'react';

import { useMe } from '../../hooks/use-me';

type OAuthUserCtx = ReturnType<typeof useMe>;
export const OAuthUserContext = createContext<OAuthUserCtx | null>(null);

export const useOAuthUser = () => {
  const value = useContext(OAuthUserContext);

  if (value === null) {
    throw new Error('Please add a OAuthUserProvider!');
  }

  return value;
};
