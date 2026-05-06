import { Link, NavLink, Route, Routes } from 'react-router';
import { authTypes } from '../../utils/types';

import TokenLogout from './token-logout';

const Header = () => {
  return (
    <header className="border-b border-b-slate-500/20 shadow-lg bg-transparent sticky top-0 backdrop-blur-sm">
      <nav className="container mx-auto flex w-full items-center py-4 justify-between">
        <Link to="/">
          <h1 className="font-semibold text-lg">Auth 🥷 Dojo</h1>
        </Link>

        <Routes>
          <Route path="token/*" element={<TokenLogout />}></Route>

          <Route path="session/*" element={<p>Session Navbar</p>}></Route>

          <Route path="oauth/*" element={<p>OAuth Navbar</p>}></Route>

          <Route
            path="*"
            element={
              <ul className="flex gap-5 items-center">
                {authTypes.map((aType) => (
                  <li key={aType}>
                    <NavLink
                      to={aType.toLowerCase()}
                      className="ring ring-slate-500 rounded-sm px-4 py-1.5 block hover:scale-105 focus-visible:scale-105 transition-[scale] aria-[current='page']:bg-slate-900 aria-[current='page']:text-slate-200"
                    >
                      {aType}
                    </NavLink>
                  </li>
                ))}
              </ul>
            }
          ></Route>
        </Routes>
      </nav>
    </header>
  );
};

export default Header;
