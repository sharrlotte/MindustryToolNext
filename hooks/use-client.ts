'use client';

import axiosInstance from '@/query/config/config';
import { AxiosInstance } from 'axios';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export type APIInstance = {
  axios: AxiosInstance;
  enabled: boolean;
};

export default function useClientAPI(): APIInstance {
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;
  const { locale } = useParams();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    axiosInstance.defaults.headers['Accept-Language'] = locale;

    if (accessToken)
      axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + accessToken;
    else {
      axiosInstance.defaults.headers['Authorization'] = '';
    }
  }, [status, accessToken, locale]);

  return { axios: axiosInstance, enabled: status !== 'loading' };
}
