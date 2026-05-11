import LoginForm from '../../components/login/login-form';
import { useLogin2fa } from '../../hooks/2fa/use-login';

const TwoFactorLogin = () => {
  const { mutate, isPending, error } = useLogin2fa();

  return <LoginForm authRoute="2fa" login={mutate} loading={isPending} error={error} />;
};

export default TwoFactorLogin;
