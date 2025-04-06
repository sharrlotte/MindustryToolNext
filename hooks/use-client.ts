'use client';

import { AxiosInstance } from 'axios';
import { useEffect } from 'react';

import { toast } from '@/components/ui/sonner';

import { DEFAULT_PAGINATION_SIZE, PAGINATION_SIZE_PERSISTENT_KEY } from '@/context/session-context.type';
import axiosInstance from '@/query/config/config';

function getCookie(name: string): string | null {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export default function useClientApi(): AxiosInstance {
  axiosInstance.defaults.timeout = 60000;

  axiosInstance.interceptors.request.clear();

  useEffect(() => {
    const id = axiosInstance.interceptors.request.use(async (config) => {
      const params = config.params;
      if (!params || !('size' in params) || 'autoSize' in params) {
        return config;
      }

      if (typeof window !== 'undefined') {
        config.params['size'] = getCookie(PAGINATION_SIZE_PERSISTENT_KEY) ?? DEFAULT_PAGINATION_SIZE;
      }

      return config;
    });

    return () => {
      axiosInstance.interceptors.request.eject(id);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const id = axiosInstance.interceptors.request.use(async (config) => {
      console.log(`CLIENT ${config.method?.toUpperCase()} ${config.baseURL}/${config.url}`);
      return config;
    });

    return () => {
      axiosInstance.interceptors.request.eject(id);
    };
  }, []);

  useEffect(() => {
    const id = axiosInstance.interceptors.response.use(
      async (response) => {
        return response;
      },

      (error) => {
        if ('status' in error) {
          toast.error(error.message);
        }
      },
    );

    return () => {
      axiosInstance.interceptors.response.eject(id);
    };
  }, []);

  return axiosInstance;
}
