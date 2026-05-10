import { Link, Route, Routes } from 'react-router';

import OAuthLogout from './logout/oauth-logout';
import SessionLogout from './logout/session-logout';
import TokenLogout from './logout/token-logout';
import NavLinks from './nav-links';

const Header = () => {
  return (
    <header className="sticky top-0 border-b border-b-slate-500/20 bg-transparent shadow-lg backdrop-blur-sm">
      <nav className="container mx-auto flex w-full items-center justify-between py-4">
        <Link to="/">
          <h1 className="text-lg font-semibold">Auth 🥷 Dojo</h1>
        </Link>

        <Routes>
          <Route path="token/*" element={<TokenLogout />}></Route>

          <Route path="session/*" element={<SessionLogout />}></Route>

          <Route path="oauth/*" element={<OAuthLogout />}></Route>

          <Route path="*" element={<NavLinks />}></Route>
        </Routes>
      </nav>
    </header>
  );
};

export default Header;
