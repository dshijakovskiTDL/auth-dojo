import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { AuthRoute, getApiUrl } from '../utils/api';

export const useLogout = (authRoute: AuthRoute) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await fetch(getApiUrl(authRoute, 'logout'), {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to logout for some reason...');
      }

      return true;
    },

    onSettled: (success) => {
      if (!success) return;

      queryClient.setQueryData([authRoute, 'me'], null);

      navigate(`/${authRoute}/login`);
    },
  });

  return { logout: () => mutate() };
};
