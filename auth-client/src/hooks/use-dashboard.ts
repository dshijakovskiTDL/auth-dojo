import { useQuery } from '@tanstack/react-query';

import { AuthRoute, getApiUrl } from '../utils/api';
import { LoginUser } from '../utils/types';

export const useDashboard = (authRoute: AuthRoute) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [authRoute, 'dashboard'],

    queryFn: async () => {
      const response = await fetch(getApiUrl(authRoute, 'dashboard'), {
        credentials: 'include',
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        throw new Error(error);
      }

      const dashboardData = (await response.json()) as { data: string; user: LoginUser };

      return dashboardData;
    },
  });

  return { data, isLoading, error };
};
