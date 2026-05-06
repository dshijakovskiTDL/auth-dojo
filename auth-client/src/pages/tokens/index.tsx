import { useQuery } from '@tanstack/react-query';
import TokenDashboard from './dashboard';
import { getApiUrl } from '../../utils/api';

const TokensDemoDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['token', 'dashboard'],
    queryFn: async () => {
      const response = await fetch(getApiUrl('token', 'dashboard'), {
        credentials: 'include',
      });

      if (!response.ok) {
        const { error } = (await response.json()) as { error: string };
        throw new Error(error);
      }

      const { data } = (await response.json()) as { data: string };
      return data;
    },
  });

  return (
    <>
      {isLoading && <p>Loading Dashboard...</p>}

      {error && <p className="font-semibold text-red-500">{error.message}</p>}

      {data && <TokenDashboard data={data} />}
    </>
  );
};

export default TokensDemoDashboard;
