import { Navigate, Outlet } from 'react-router';

import { useSessionUser } from '../../context/session-user';

type Props = {
  mode: 'auth' | 'no-auth';
};

const SessionLayout = ({ mode }: Props) => {
  const { user, isLoading, error } = useSessionUser();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
  }

  if (mode === 'auth') {
    if (user) {
      return <Outlet />;
    }

    return <Navigate to="/session/login" />;
  }

  if (mode === 'no-auth') {
    if (user) {
      return <Navigate to="/session" />;
    }

    return <Outlet />;
  }

  throw new Error('Invalid layout state!');
};

export default SessionLayout;
