import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { getApiUrl } from '../../utils/api';

export const useLogin2fa = () => {
  const navigate = useNavigate();

  return useMutation<boolean, Error, { email: string; password: string }>({
    mutationFn: async (body) => {
      const response = await fetch(getApiUrl('2fa', 'login'), {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        throw new Error(error);
      }

      return true;
    },

    onSettled: (success) => {
      if (!success) return;

      navigate('/2fa/verify');
    },
  });
};
