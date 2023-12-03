'use client';

import { isSameDay } from '@/lib/utils';
import axiosClient, { addRefreshInterceptor } from '@/query/config/axios-config';
import React, { useEffect } from 'react';

export default function ClientInit() {
  useEffect(() => {
    addRefreshInterceptor();

    // For metrics
    const last = localStorage.getItem('last');
    if (!last || !isSameDay(new Date(last), new Date())) {
      axiosClient
        .get('/ping')
        .then((result) => console.log(result.data))
        .catch((error) => console.error(error));
    }
    localStorage.setItem('last', new Date().toISOString());
  }, []);

  return undefined;
}
