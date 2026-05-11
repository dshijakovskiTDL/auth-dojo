import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { API_BASE_URL, AuthRoute } from '../utils/api';
import { LoginUser } from '../utils/types';

type SignupUser = {
  email: string;
  name: string;
  password: string;
};

export const useSignup = (authRoute: AuthRoute) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<LoginUser | undefined, Error, SignupUser>({
    mutationFn: async (body) => {
      const apiUrl = new URL(API_BASE_URL + '/signup');
      apiUrl.searchParams.set('authMode', authRoute);

      const response = await fetch(apiUrl.toString(), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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

      if (authRoute === '2fa') {
        navigate(`/2fa/login`);
        return;
      }

      queryClient.setQueryData([authRoute, 'me'], userData);
      navigate(`/${authRoute}`);
    },
  });
};
