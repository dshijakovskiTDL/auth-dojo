import LogoutButton from './logout';

import { useSessionUser } from '../../../context/session-user';

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
