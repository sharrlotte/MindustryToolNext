'use client';

import useClient from '@/hooks/use-client';
import React, { useEffect } from 'react';

export default function ClientInit() {
  const axiosClient = useClient();

  useEffect(() => {
    axiosClient.get('/ping').catch((error) => console.error(error));
  }, [axiosClient]);

  return undefined;
}
