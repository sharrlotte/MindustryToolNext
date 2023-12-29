import env from '@/constant/env';
import { auth } from '@/auth/config';
import Axios from 'axios';
import { APIInstance } from '@/hooks/use-client';

const axios = Axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
});

const getServerAPI = async (): Promise<APIInstance> => {
  const session = await auth();
  const accessToken = session?.user?.accessToken;

  if (accessToken) {
    axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    axios.defaults.headers['Authorization'] = '';
  }

  return { axios, enabled: true };
};

export default getServerAPI;
