'use client';

import useClientAPI from '@/hooks/use-client';

import { useQuery } from '@tanstack/react-query';

export default function ClientInit() {
  const axios = useClientAPI();

  useQuery({
    queryFn: () => axios.get('/ping?client=web'),
    queryKey: ['ping'],
  });

  return undefined;
}
