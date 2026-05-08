import { Link, Route, Routes } from 'react-router';

import TokenLogout from './logout-buttons/token-logout';
import SessionLogout from './logout-buttons/session-logout';
import NavLinks from './nav-links';

const Header = () => {
  return (
    <header className="border-b border-b-slate-500/20 shadow-lg bg-transparent sticky top-0 backdrop-blur-sm">
      <nav className="container mx-auto flex w-full items-center py-4 justify-between">
        <Link to="/">
          <h1 className="font-semibold text-lg">Auth 🥷 Dojo</h1>
        </Link>

        <Routes>
          <Route path="token/*" element={<TokenLogout />}></Route>

          <Route path="session/*" element={<SessionLogout />}></Route>

          <Route path="oauth/*" element={<p>OAuth Navbar</p>}></Route>

          <Route path="*" element={<NavLinks />}></Route>
        </Routes>
      </nav>
    </header>
  );
};

export default Header;
