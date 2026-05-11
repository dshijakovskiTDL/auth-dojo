import { Link, Route, Routes } from 'react-router';

import { AuthRoute } from '../../utils/api';
import TwoFactorLogout from './logout/2fa-logout';
import OAuthLogout from './logout/oauth-logout';
import SessionLogout from './logout/session-logout';
import TokenLogout from './logout/token-logout';
import NavLinks from './nav-links';

const AUTH_TYPES: Array<{ path: AuthRoute; LogoutComponent: () => JSX.Element | null }> =
  [
    { path: 'token', LogoutComponent: TokenLogout },
    { path: 'session', LogoutComponent: SessionLogout },
    { path: 'oauth', LogoutComponent: OAuthLogout },
    { path: '2fa', LogoutComponent: TwoFactorLogout },
  ] as const;

const Header = () => {
  return (
    <header className="sticky top-0 border-b border-b-slate-500/20 bg-transparent shadow-lg backdrop-blur-sm">
      <nav className="container mx-auto flex w-full items-center justify-between py-4">
        <Link to="/">
          <h1 className="text-lg font-semibold">Auth 🥷 Dojo</h1>
        </Link>

        <Routes>
          {AUTH_TYPES.map(({ path, LogoutComponent }) => (
            <Route key={path} path={`${path}/*`}>
              <Route index element={<LogoutComponent />} />
              <Route path="*" element={<NavLinks />} />
            </Route>
          ))}

          <Route path="*" element={<NavLinks />}></Route>
        </Routes>
      </nav>
    </header>
  );
};

export default Header;
