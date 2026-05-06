import { Navigate, Outlet } from 'react-router';
import { useTokenUser } from '../../context/token-user';

const HomepageLayout = () => {
  const { user: tokenUser } = useTokenUser();

  if (tokenUser) {
    return <Navigate to="/token" />;
  }

  return <Outlet />;
};

export default HomepageLayout;
