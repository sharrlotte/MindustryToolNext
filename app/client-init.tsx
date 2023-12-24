'use client';

import useClient from '@/hooks/use-client';
import React, { useEffect } from 'react';

export default function ClientInit() {
  const { axiosClient, enabled } = useClient();

  useEffect(() => {
    if (enabled) {
      axiosClient.get('/ping').catch((error) => console.error(error));
    }
  }, [axiosClient, enabled]);

  return undefined;
}
