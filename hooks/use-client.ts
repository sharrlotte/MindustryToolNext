import env from '@/constant/env';
import axios, { AxiosInstance } from 'axios';
import { useSession } from 'next-auth/react';

const axiosClient = axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
});

export type UseClient = {
  axiosClient: AxiosInstance;
  enabled: boolean;
};

export default function useClient(): UseClient {
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;

  if (accessToken) {
    axiosClient.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    axiosClient.defaults.headers['Authorization'] = '';
  }

  return { axiosClient, enabled: status !== 'loading' };
}
