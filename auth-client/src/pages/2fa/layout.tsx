import { useTwoFactorUser } from '../../context/2fa-user';
import AuthLayout, { AuthProtectMode } from '../auth-layout';

type Props = {
  mode: AuthProtectMode;
};

const TwoFactorLayout = ({ mode }: Props) => {
  const twoFactorUser = useTwoFactorUser();

  return <AuthLayout mode={mode} authRoute="2fa" userCtx={twoFactorUser} />;
};

export default TwoFactorLayout;
