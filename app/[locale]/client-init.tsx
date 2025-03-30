'use client';

import useClientApi from '@/hooks/use-client';

import { useQuery } from '@tanstack/react-query';

export default function ClientInit() {
  const axios = useClientApi();

  useQuery({
    queryKey: ['ping'],
    queryFn: () => axios.get('/ping?client=web'),
  });

  return undefined;
}
