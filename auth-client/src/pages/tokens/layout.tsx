import { useTokenUser } from '../../context/token-user';
import AuthLayout, { AuthProtectMode } from '../auth-layout';

type Props = {
  mode: AuthProtectMode;
};

const TokensLayout = ({ mode }: Props) => {
  const tokenUser = useTokenUser();

  return <AuthLayout mode={mode} authRoute="token" userCtx={tokenUser} />;
};

export default TokensLayout;
