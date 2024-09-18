'use client';

import { AxiosInstance } from 'axios';

import axiosInstance from '@/query/config/config';

export default function useClientApi(): AxiosInstance {
  return axiosInstance;
}
