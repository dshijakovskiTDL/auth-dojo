import { useQuery } from '@tanstack/react-query';

import { AuthRoute, getApiUrl } from '../utils/api';

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

      const { data } = (await response.json()) as { data: string };

      return data;
    },
  });

  return { data, isLoading, error };
};
