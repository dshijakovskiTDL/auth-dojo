import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { getApiUrl } from '../../utils/api';
import LogoutButton from '../logout-button';
import { useTokenUser } from '../../context/token-user';

const TokenLogout = () => {
  const { user, isLoading } = useTokenUser();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await fetch(getApiUrl('token', 'logout'), {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to logout for some reason...');
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(['token', 'me'], null);
      navigate('/token/login');
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

export default TokenLogout;
