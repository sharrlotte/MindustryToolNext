import env from '@/constant/env';
import Axios, { AxiosInstance } from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const axios = Axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
});

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
      axios.defaults.headers['Authorization'] = 'Bearer ' + accessToken;
    else {
      axios.defaults.headers['Authorization'] = '';
    }
  }, [status, accessToken]);

  return { axios, enabled: status !== 'loading' };
}
