import LoginForm from '../../components/login/login-form';
import { useLogin } from '../../hooks/use-login';

const SessionLogin = () => {
  const { mutate, isPending, error } = useLogin('session');

  return (
    <LoginForm authRoute="session" login={mutate} loading={isPending} error={error} />
  );
};

export default SessionLogin;
