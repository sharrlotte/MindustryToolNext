'use client';

import ErrorScreen from '@/components/common/error-screen';

import useClientApi from '@/hooks/use-client';
import { isError } from '@/lib/utils';

import { useQuery } from '@tanstack/react-query';

export default function ClientInit({ children }: { children: React.ReactNode }) {
  const axios = useClientApi();

  const { data } = useQuery({
    queryFn: async () => {
      try {
        return axios.get('/ping?client=web');
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }

        return { error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))) };
      }
    },
    queryKey: ['ping'],
  });

  if (data && isError(data)) {
    return <ErrorScreen error={data} />;
  }

  return children;
}
