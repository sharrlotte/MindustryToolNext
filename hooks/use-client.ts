'use client';

import { AxiosInstance } from 'axios';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import axiosInstance from '@/query/config/config';

export default function useClientApi(): AxiosInstance {
  const { locale } = useParams();

  useEffect(() => {
    axiosInstance.defaults.headers['Accept-Language'] = locale as string;
  }, [locale]);

  return axiosInstance;
}
