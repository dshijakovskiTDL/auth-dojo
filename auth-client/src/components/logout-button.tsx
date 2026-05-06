const Skeleton = () => {
  return (
    <div className="h-8 w-24 bg-slate-500/20 rounded-sm animate-pulse"></div>
  );
};

const LogoutButton = ({ logout }: { logout: () => void }) => {
  return (
    <button
      onClick={logout}
      className="bg-slate-900 text-slate-200 rounded-sm px-4 py-1.5 active:scale-95 duration-150"
    >
      Log out
    </button>
  );
};

LogoutButton.Skeleton = Skeleton;

export default LogoutButton;
