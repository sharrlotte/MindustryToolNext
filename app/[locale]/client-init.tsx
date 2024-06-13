'use client';

import useClientAPI from '@/hooks/use-client';

import { useEffect } from 'react';

export default function ClientInit() {
  const axios = useClientAPI();

  useEffect(() => {
      axios.get('/ping?client=web').catch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axios]);

  return undefined;
}
