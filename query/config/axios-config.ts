import env from '@/constant/env';
import { auth } from '@/auth/config';
import axios from 'axios';

const axiosServer = axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
});

const getServer = async () => {
  const session = await auth();
  const accessToken = session?.user?.accessToken;
  if (accessToken) {
    axiosServer.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    axiosServer.defaults.headers['Authorization'] = '';
  }

  return axiosServer;
};

export default getServer;
