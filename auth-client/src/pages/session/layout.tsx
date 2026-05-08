import AuthLayout, { AuthProtectMode } from '../auth-layout';

import { useSessionUser } from '../../context/session-user';

type Props = {
  mode: AuthProtectMode;
};

const SessionLayout = ({ mode }: Props) => {
  const sessionUser = useSessionUser();

  return <AuthLayout authRoute="session" mode={mode} userCtx={sessionUser} />;
};

export default SessionLayout;
