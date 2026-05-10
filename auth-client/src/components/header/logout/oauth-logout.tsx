import LogoutButton from '.';
import { useOAuthUser } from '../../../context/oauth-user';

const OAuthLogout = () => {
  const { user, isLoading } = useOAuthUser();

  if (isLoading) {
    return <LogoutButton.Skeleton />;
  }

  if (!user) {
    return null;
  }

  return <LogoutButton authRoute="oauth" />;
};

export default OAuthLogout;
