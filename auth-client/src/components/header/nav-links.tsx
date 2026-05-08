import { NavLink } from 'react-router';

import { useSessionUser } from '../../context/session-user';
import { useTokenUser } from '../../context/token-user';

import { AuthType, authTypes } from '../../utils/types';

const NavLinks = () => {
  const { user: tokenUser } = useTokenUser();
  const { user: sessionUser } = useSessionUser();

  const showLoggedInStatus = (authType: AuthType) => {
    if (authType === 'Token' && tokenUser) return true;

    if (authType === 'Session' && sessionUser) return true;

    return false;
  };

  return (
    <ul className="flex gap-8 items-center">
      {authTypes.map((aType) => (
        <li key={aType}>
          <NavLink
            to={aType.toLowerCase()}
            className="ring relative ring-slate-500 rounded-sm px-4 py-1.5 block hover:scale-105 focus-visible:scale-105 transition-[scale]"
          >
            {aType}

            {showLoggedInStatus(aType) && (
              <span className="absolute px-2 py-1 text-xs top-0 right-0 scale-90 font-semibold translate-x-1/3 -translate-y-1/2 bg-emerald-400 z-100 rounded-md whitespace-nowrap flex">
                Logged in
              </span>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
