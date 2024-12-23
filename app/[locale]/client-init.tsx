'use client';

import useClientApi from '@/hooks/use-client';

import { useQuery } from '@tanstack/react-query';

export default function ClientInit() {
  const axios = useClientApi();

  useQuery({
    queryFn: () => {
      try {
        axios.get('/ping?client=web');
      } catch {
        // Ignore
      }
      return null;
    },
    queryKey: ['ping'],
  });

  return undefined;
}
