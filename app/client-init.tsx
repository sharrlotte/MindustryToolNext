'use client';

import useClientAPI from '@/hooks/use-client';
import React, { useEffect } from 'react';

export default function ClientInit() {
  const { axios, enabled } = useClientAPI();

  useEffect(() => {
    if (enabled) {
      axios.get('/ping').catch((error) => console.error(error));
    }
  }, [axios, enabled]);

  return undefined;
}
