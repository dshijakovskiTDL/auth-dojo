import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LoginUser } from '../utils/types';
import { AuthRoute, getApiUrl } from '../utils/api';

export const useLogin = (authRoute: AuthRoute) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<LoginUser | undefined, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      const body = { email, password };

      const response = await fetch(getApiUrl(authRoute, 'login'), {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        throw new Error(error);
      }

      const userData = (await response.json()) as LoginUser;
      return userData;
    },

    onSettled: (userData) => {
      if (!userData) return;

      queryClient.setQueryData([authRoute, 'me'], userData);
      navigate(`/${authRoute}`);
    },
  });
};
