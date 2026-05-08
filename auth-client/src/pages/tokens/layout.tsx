import AuthLayout, { AuthProtectMode } from '../auth-layout';

import { useTokenUser } from '../../context/token-user';

type Props = {
  mode: AuthProtectMode;
};

const TokensLayout = ({ mode }: Props) => {
  const tokenUser = useTokenUser();

  return <AuthLayout mode={mode} authRoute="token" userCtx={tokenUser} />;
};

export default TokensLayout;
