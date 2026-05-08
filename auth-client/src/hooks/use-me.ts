import { useQuery } from '@tanstack/react-query';

import { AuthRoute, getApiUrl } from '../utils/api';
import { LoginUser } from '../utils/types';

export const useMe = (authRoute: AuthRoute) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [authRoute, 'me'],

    queryFn: async () => {
      const response = await fetch(getApiUrl(authRoute, 'me'), {
        credentials: 'include',
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        console.error(error);

        return null;
      }

      const user = (await response.json()) as LoginUser;
      return user;
    },
  });

  return { user: data, isLoading, error };
};
