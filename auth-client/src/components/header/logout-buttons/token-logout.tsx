import { useTokenUser } from '../../../context/token-user';
import LogoutButton from './logout';

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
