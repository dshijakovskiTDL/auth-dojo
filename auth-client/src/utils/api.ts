export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ROUTES = {
  token: {
    me: '/token/me',
    login: '/token/login',
    logout: '/token/logout',
    dashboard: '/token/dashboard',
  },

  session: {
    me: '/session/me',
    login: '/session/login',
    logout: '/session/logout',
    dashboard: '/session/dashboard',
  },

  oauth: {
    me: '/oauth/me',
    login: '/oauth/login',
    logout: '/oauth/logout',
    dashboard: '/oauth/dashboard',
  },
};

export type AuthRoute = keyof typeof ROUTES;
export type Endpoint<T extends AuthRoute> = keyof (typeof ROUTES)[T];

export const getApiUrl = <T extends AuthRoute>(authRoute: T, endpoint: Endpoint<T>) => {
  return API_BASE_URL + ROUTES[authRoute][endpoint];
};
