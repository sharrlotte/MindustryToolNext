import { AxiosInstance } from 'axios';
import { cookies } from 'next/headers';
import 'server-only';

import axiosInstance from '@/query/config/config';

const getServerAPI = async (): Promise<AxiosInstance> => {
  const cookie = cookies().toString();

  axiosInstance.defaults.headers['Cookie'] = cookie;

  return axiosInstance;
};

export default getServerAPI;
