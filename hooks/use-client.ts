'use client';

import { AxiosInstance } from 'axios';

import axiosInstance from '@/query/config/config';

export default function useClientApi(): AxiosInstance {
  axiosInstance.defaults.timeout = 60000;

  return axiosInstance;
}
