import { useQuery } from '@tanstack/react-query';
import { TokenUser } from '.';
import { getApiUrl } from '../../utils/api';

export const useMeToken = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['token', 'me'],

    queryFn: async () => {
      const response = await fetch(getApiUrl('token', 'me'), {
        credentials: 'include',
      });
      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        console.error(error);

        return null;
      }

      const user = (await response.json()) as TokenUser;
      return user;
    },
  });

  return { user: data, isLoading, error };
};
