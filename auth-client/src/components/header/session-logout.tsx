import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

import LogoutButton from '../logout-button';

import { getApiUrl } from '../../utils/api';
import { useSessionUser } from '../../context/session-user';

const SessionLogout = () => {
  const { user, isLoading } = useSessionUser();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await fetch(getApiUrl('session', 'logout'), {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to logout for some reason...');
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(['session', 'me'], null);
      navigate('/session/login');
    },
  });

  const logout = () => {
    mutate();
  };

  if (isLoading) {
    return <LogoutButton.Skeleton />;
  }

  if (!user) {
    return null;
  }

  return <LogoutButton logout={logout} />;
};

export default SessionLogout;
