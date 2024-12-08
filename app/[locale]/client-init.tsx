'use client';

import ErrorScreen from '@/components/common/error-screen';

import useClientApi from '@/hooks/use-client';

import { useQuery } from '@tanstack/react-query';

export default function ClientInit({ children }: { children: React.ReactNode }) {
  const axios = useClientApi();

  const { isError, error } = useQuery({
    queryFn: () => axios.get('/ping?client=web'),
    queryKey: ['ping'],
  });

  if (isError) {
    return <ErrorScreen error={error} />;
  }

  return children;
}
