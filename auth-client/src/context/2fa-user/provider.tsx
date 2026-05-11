import { PropsWithChildren } from 'react';

import { TwoFactorUserContext } from '.';
import { useMe } from '../../hooks/use-me';

export const TwoFactorUserProvider = ({ children }: PropsWithChildren) => {
  const value = useMe('2fa');

  return (
    <TwoFactorUserContext.Provider value={value}>
      {children}
    </TwoFactorUserContext.Provider>
  );
};
