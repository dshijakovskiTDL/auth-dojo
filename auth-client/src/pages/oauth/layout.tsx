import { useOAuthUser } from '../../context/oauth-user';
import AuthLayout, { AuthProtectMode } from '../auth-layout';

type Props = {
  mode: AuthProtectMode;
};

const OAuthLayout = ({ mode }: Props) => {
  const oauthUser = useOAuthUser();

  return <AuthLayout mode={mode} authRoute="oauth" userCtx={oauthUser} />;
};

export default OAuthLayout;
