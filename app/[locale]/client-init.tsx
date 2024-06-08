'use client';

import useClientAPI from '@/hooks/use-client';

import { useEffect } from 'react';

export default function ClientInit() {
  const { axios, enabled } = useClientAPI();

  useEffect(() => {
    if (enabled) {
      axios.get('/ping?client=web').catch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axios, enabled]);

  return undefined;
}
