import { useQuery } from '@tanstack/react-query';

import Dashboard from '../../components/dashboard';

import { getApiUrl } from '../../utils/api';

const SessionHomepage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['session', 'dashboard'],
    queryFn: async () => {
      const response = await fetch(getApiUrl('session', 'dashboard'), {
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

      {data && <Dashboard data={data} />}
    </>
  );
};

export default SessionHomepage;
