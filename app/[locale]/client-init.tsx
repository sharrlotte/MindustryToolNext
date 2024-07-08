'use client';

import { useEffect } from 'react';

import useClientAPI from '@/hooks/use-client';

export default function ClientInit() {
  const axios = useClientAPI();

  useEffect(() => {
    axios.get('/ping?client=web').catch();
  }, [axios]);

  return undefined;
}
