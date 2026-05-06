const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ROUTES = {
  token: {
    me: '/token/me',
    login: '/token/login',
    logout: '/token/logout',
    dashboard: '/token/dashboard',
  },
};

type AuthRoute = keyof typeof ROUTES;
type Endpoint<T extends AuthRoute> = keyof (typeof ROUTES)[T];

export const getApiUrl = <T extends AuthRoute>(
  authRoute: T,
  endpoint: Endpoint<T>,
) => {
  return API_BASE_URL + ROUTES[authRoute][endpoint];
};
