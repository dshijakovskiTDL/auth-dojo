import { PropsWithChildren } from 'react';

import { OAuthUserContext } from '.';
import { useMe } from '../../hooks/use-me';

export const OAuthUserProvider = ({ children }: PropsWithChildren) => {
  const value = useMe('oauth');

  return <OAuthUserContext.Provider value={value}>{children}</OAuthUserContext.Provider>;
};
