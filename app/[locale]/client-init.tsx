'use client';

import useClientApi from '@/hooks/use-client';
import { Batcher } from '@/lib/batcher';

import { useQuery } from '@tanstack/react-query';
import { useInterval } from 'usehooks-ts';

export default function ClientInit() {
  const axios = useClientApi();

  useQuery({
    queryKey: ['ping'],
    queryFn: () => axios.get('/ping?client=web'),
  });

  useInterval(async () => {
    await Batcher.process();
  }, 100)

  return undefined;
}
