import { useDashboard } from '../hooks/use-dashboard';
import { AuthRoute } from '../utils/api';

type Props = {
  authRoute: AuthRoute;
};

const Dashboard = ({ authRoute }: Props) => {
  const { data, isLoading, error } = useDashboard(authRoute);

  return (
    <>
      {isLoading && <p>Loading Dashboard...</p>}

      {error && <p className="font-semibold text-red-500">Error: {error.message}</p>}

      {data && (
        <div className="grid place-content-center gap-4 text-center">
          <p className="text-lg font-semibold">{data.data}</p>

          <div className="flex items-center gap-4">
            {data.user.avatarUrl && (
              <img
                src={data.user.avatarUrl}
                referrerPolicy="no-referrer" // important for Google avatar URLs
                className="rounded-full size-10"
              />
            )}

            <p>
              {data.user.firstName} {data.user.lastName}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
