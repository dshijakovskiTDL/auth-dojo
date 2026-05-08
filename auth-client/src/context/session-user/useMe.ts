import { useQuery } from '@tanstack/react-query';
import { LoginUser } from '../../utils/types';
import { getApiUrl } from '../../utils/api';

export const useMeSession = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['session', 'me'],
    queryFn: async () => {
      const response = await fetch(getApiUrl('session', 'me'), {
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
