import { useLogout } from '../../../hooks/use-logout';
import { AuthRoute } from '../../../utils/api';

const Skeleton = () => {
  return <div className="h-9 w-24 animate-pulse rounded-sm bg-slate-500/20"></div>;
};

type Props = {
  authRoute: AuthRoute;
};

const LogoutButton = ({ authRoute }: Props) => {
  const { logout } = useLogout(authRoute);

  return (
    <button
      onClick={logout}
      className="rounded-sm bg-slate-900 px-4 py-1.5 text-slate-200 duration-150 active:scale-95"
    >
      Log out
    </button>
  );
};

LogoutButton.Skeleton = Skeleton;

export default LogoutButton;
