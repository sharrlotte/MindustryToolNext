'use client';

import { useInterval } from 'usehooks-ts';

import useClientApi from '@/hooks/use-client';
import { Batcher } from '@/lib/batcher';

import { useQuery } from '@tanstack/react-query';

export default function ClientInit() {
  const axios = useClientApi();

  useQuery({
    queryKey: ['ping'],
    queryFn: () => axios.get('/ping?client=web'),
  });

  useInterval(async () => {
    await Batcher.process();
  }, 50);

  return undefined;
}
