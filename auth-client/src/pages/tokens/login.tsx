import LoginForm from '../../components/login/login-form';
import { useLogin } from '../../hooks/use-login';

const TokenLogin = () => {
  const { mutate, isPending, error } = useLogin('token');

  return <LoginForm authRoute="token" login={mutate} loading={isPending} error={error} />;
};

export default TokenLogin;
