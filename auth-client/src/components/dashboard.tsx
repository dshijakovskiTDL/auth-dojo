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

      {error && <p className="font-semibold text-red-500">{error.message}</p>}

      {data && (
        <div className="grid gap-4 place-content-center">
          <p>{data}</p>
        </div>
      )}
    </>
  );
};

export default Dashboard;
