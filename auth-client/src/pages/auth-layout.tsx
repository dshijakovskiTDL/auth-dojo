import { Navigate, Outlet } from 'react-router';
import { useMe } from '../hooks/use-me';
import { AuthRoute } from '../utils/api';

export type AuthProtectMode = 'auth' | 'no-auth';

type Props = {
  mode: AuthProtectMode;
  authRoute: AuthRoute;
  userCtx: ReturnType<typeof useMe>;
};

const AuthLayout = ({ mode, authRoute, userCtx }: Props) => {
  const { user, isLoading, error } = userCtx;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
  }

  // Auth mode - protect sensitive routes that require authentication to access
  if (mode === 'auth') {
    if (user) {
      return <Outlet />;
    }

    return <Navigate to={`/${authRoute}/login`} />;
  }

  // No-Auth mode - protect login-like pages when authenticated

  if (mode === 'no-auth') {
    if (user) {
      return <Navigate to={`/${authRoute}`} />;
    }

    return <Outlet />;
  }

  throw new Error('Invalid layout state!');
};

export default AuthLayout;
