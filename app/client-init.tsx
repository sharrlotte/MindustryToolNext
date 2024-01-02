'use client';

import useClientAPI from '@/hooks/use-client';
import { useEffect } from 'react';

export default function ClientInit() {
  const { axios, enabled } = useClientAPI();

  useEffect(() => {
    if (enabled) {
      axios.get('/ping?client=web').catch((error) => console.error(error));
    }
  }, [axios, enabled]);

  return undefined;
}
