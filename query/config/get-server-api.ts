import axiosInstance from '@/query/config/config';

import { AxiosInstance } from 'axios';
import { cookies } from 'next/headers';
import 'server-only';

const getServerAPI = async (): Promise<{
  axios: AxiosInstance;
  enabled: boolean;
}> => {
  const cookie = cookies().toString();

  axiosInstance.defaults.headers['Cookie'] = cookie;

  return { axios: axiosInstance, enabled: true };
};

export default getServerAPI;
