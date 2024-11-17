'use client';

import useClientApi from '@/hooks/use-client';

import { useQuery } from '@tanstack/react-query';

export default function ClientInit() {
  const axios = useClientApi();

  useQuery({
    queryFn: () => axios.get('/ping?client=web'),
    queryKey: ['ping'],
  });

  return undefined;
}
