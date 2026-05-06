import { Navigate, Outlet } from 'react-router';
import { useTokenUser } from '../../context/token-user';

type Props = {
  mode: 'auth' | 'no-auth';
};

const TokensLayout = ({ mode }: Props) => {
  const { user, isLoading, error } = useTokenUser();

  if (isLoading) {
    // TODO: Maybe dashboard skeleton?
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
  }

  if (mode === 'auth') {
    if (user) {
      return <Outlet />;
    }

    return <Navigate to="/token/login" />;
  }

  if (mode === 'no-auth') {
    if (user) {
      return <Navigate to="/token" />;
    }

    return <Outlet />;
  }

  throw new Error('Invalid layout state!');
};

export default TokensLayout;
