'use client';

import axiosInstance from '@/query/config/config';

import { AxiosInstance } from 'axios';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

//TODO Remove this shit
export type APIInstance = {
  axios: AxiosInstance;
  enabled: boolean;
};

export default function useClientAPI(): APIInstance {
  const { locale } = useParams();

  useEffect(() => {
    axiosInstance.defaults.headers['Accept-Language'] = locale;
  }, [locale]);

  return { axios: axiosInstance, enabled: true };
}
