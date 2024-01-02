import env from '@/constant/env';
import { auth, authData } from '@/auth/config';
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
  const userId = session?.user?.id;

  if (userId) {
    axios.defaults.headers['Authorization'] = authData.accessToken;
    axios.defaults.headers['Authorization-As'] = userId;
  } else {
    axios.defaults.headers['Authorization-As'] = '';
  }

  return { axios, enabled: true };
};

export default getServerAPI;
