import env from '@/constant/env';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const axiosClient = axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
});

export default function useClient() {
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken;

  if (accessToken) {
    axiosClient.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    axiosClient.defaults.headers['Authorization'] = '';
  }

  return axiosClient;
}
