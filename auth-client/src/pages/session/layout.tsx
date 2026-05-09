import { useSessionUser } from '../../context/session-user';
import AuthLayout, { AuthProtectMode } from '../auth-layout';

type Props = {
  mode: AuthProtectMode;
};

const SessionLayout = ({ mode }: Props) => {
  const sessionUser = useSessionUser();

  return <AuthLayout authRoute="session" mode={mode} userCtx={sessionUser} />;
};

export default SessionLayout;
