import LogoutButton from '.';
import { useTwoFactorUser } from '../../../context/2fa-user';

const TwoFactorLogout = () => {
  const { user, isLoading } = useTwoFactorUser();

  if (isLoading) {
    return <LogoutButton.Skeleton />;
  }

  if (!user) {
    return null;
  }

  return <LogoutButton authRoute="2fa" />;
};

export default TwoFactorLogout;
