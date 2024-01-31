'use client';

import axiosInstance from '@/query/config/config';
import { AxiosInstance } from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export type APIInstance = {
  axios: AxiosInstance;
  enabled: boolean;
};

export default function useClientAPI(): APIInstance {
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (accessToken)
      axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + accessToken;
    else {
      axiosInstance.defaults.headers['Authorization'] = '';
    }
  }, [status, accessToken]);

  return { axios: axiosInstance, enabled: status !== 'loading' };
}
