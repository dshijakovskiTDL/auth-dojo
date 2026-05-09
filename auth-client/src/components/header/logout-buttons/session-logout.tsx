import { useSessionUser } from '../../../context/session-user';
import LogoutButton from './logout';

const SessionLogout = () => {
  const { user, isLoading } = useSessionUser();

  if (isLoading) {
    return <LogoutButton.Skeleton />;
  }

  if (!user) {
    return null;
  }

  return <LogoutButton authRoute="session" />;
};

export default SessionLogout;
