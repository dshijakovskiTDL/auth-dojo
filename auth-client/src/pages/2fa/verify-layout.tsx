import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router';

import { getApiUrl } from '../../utils/api';

const TwoFactorVerifyLayout = () => {
  const { isSuccess, isLoading, error } = useQuery({
    queryKey: ['2fa', 'pre-auth-verify'],
    retry: 0,

    queryFn: async () => {
      const response = await fetch(getApiUrl('2fa', 'verify'), {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        throw new Error(error);
      }

      return true;
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);
  }

  if (isSuccess) {
    return <Outlet />;
  }

  return <Navigate to="/2fa/login" />;
};

export default TwoFactorVerifyLayout;
