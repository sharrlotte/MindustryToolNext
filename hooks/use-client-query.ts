import { AxiosInstance } from 'axios';

import useClientApi from '@/hooks/use-client';

import { useQuery } from '@tanstack/react-query';

type Param<T> = Omit<Parameters<typeof useQuery<T>>[0], 'queryFn'> & {
  queryFn: (axios: AxiosInstance) => Promise<T>;
};

export default function useClientQuery<T>({ queryFn, ...params }: Param<T>) {
  const axios = useClientApi();

  return useQuery({
    ...params,
    queryFn: () => queryFn(axios),
  });
}
