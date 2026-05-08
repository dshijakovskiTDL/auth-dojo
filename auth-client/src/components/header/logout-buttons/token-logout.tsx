import LogoutButton from './logout';

import { useTokenUser } from '../../../context/token-user';

const TokenLogout = () => {
  const { user, isLoading } = useTokenUser();

  if (isLoading) {
    return <LogoutButton.Skeleton />;
  }

  if (!user) {
    return null;
  }

  return <LogoutButton authRoute="token" />;
};

export default TokenLogout;
