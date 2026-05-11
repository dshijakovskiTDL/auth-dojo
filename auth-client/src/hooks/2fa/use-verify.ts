import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { getApiUrl } from '../../utils/api';
import { LoginUser } from '../../utils/types';

export const useVerify2fa = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<LoginUser | undefined, Error, { code: string }>({
    mutationFn: async (body) => {
      const response = await fetch(getApiUrl('2fa', 'verify'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
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

      queryClient.setQueryData(['2fa', 'me'], userData);
      navigate('/2fa');
    },
  });
};
