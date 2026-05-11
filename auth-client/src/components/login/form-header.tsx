import { AuthRoute } from '../../utils/api';

const loginFormHeader: Record<AuthRoute, { title: string; description: string }> = {
  token: {
    title: 'Token based Authentication',
    description: 'Access + Refresh token cookies',
  },

  session: {
    title: 'Session based Authentication',
    description: 'Simple session cookie Auth',
  },

  oauth: {
    title: 'OAuth 2.0 based Authentication',
    description: 'OAuth + Session based Auth',
  },

  '2fa': {
    title: 'Two Factor Authentication',
    description: 'Email based 2FA + Session based Auth',
  },
};

type Props = {
  authRoute: AuthRoute;
};

const LoginFormHeader = ({ authRoute }: Props) => {
  return (
    <div className="text-center">
      <h2 className="text-center text-2xl">{loginFormHeader[authRoute].title}</h2>
      <p className="font-light">{loginFormHeader[authRoute].description}</p>
    </div>
  );
};

export default LoginFormHeader;
