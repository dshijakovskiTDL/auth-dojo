import { NavLink } from 'react-router';

import { useOAuthUser } from '../../context/oauth-user';
import { useSessionUser } from '../../context/session-user';
import { useTokenUser } from '../../context/token-user';
import { AuthType, authTypes } from '../../utils/types';

const NavLinks = () => {
  const { user: tokenUser } = useTokenUser();
  const { user: sessionUser } = useSessionUser();
  const { user: oAuthUser } = useOAuthUser();

  const showLoggedInStatus = (authType: AuthType) => {
    if (authType === 'Token' && tokenUser) return true;

    if (authType === 'Session' && sessionUser) return true;

    if (authType === 'OAuth' && oAuthUser) return true;

    return false;
  };

  return (
    <ul className="flex items-center gap-4">
      {authTypes.map((aType) => (
        <li key={aType} className="relative">
          <NavLink
            to={aType.toLowerCase()}
            className="block rounded-sm px-4 py-1.5 ring ring-slate-900 outline-offset-3 outline-slate-900 transition-colors hover:bg-slate-900 hover:text-slate-200 focus-visible:bg-slate-900 focus-visible:text-slate-200"
          >
            {aType}

            {showLoggedInStatus(aType) && (
              <span className="absolute top-0 right-0 z-100 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 p-1.5 text-xs font-semibold text-slate-900">
                <span className="sr-only">Logged in</span>
                <svg
                  aria-hidden="true"
                  className="size-3 fill-slate-900"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" />
                  <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" />
                </svg>
              </span>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
