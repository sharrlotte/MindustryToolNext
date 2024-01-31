'use client';

import env from '@/constant/env';
import Axios, { AxiosInstance } from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export type APIInstance = {
  axios: AxiosInstance;
  enabled: boolean;
};

const axiosInstance = Axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.data) {
      throw error.response.data;
    }

    throw error;
  },
);

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
