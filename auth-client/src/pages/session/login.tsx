import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';

import LoginForm from '../../components/login-form';

import { LoginUser } from '../../utils/types';
import { useLogin } from '../../hooks/use-login';

const SessionLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSuccess = (userData: LoginUser) => {
    queryClient.setQueryData(['session', 'me'], userData);
    navigate('/session');
  };

  const loginMutation = useLogin('session', onSuccess);

  return <LoginForm authType="Session" loginMutation={loginMutation} />;
};

export default SessionLogin;
