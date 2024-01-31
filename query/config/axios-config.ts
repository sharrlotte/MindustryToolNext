import 'server-only';
import env from '@/constant/env';
import { auth } from '@/auth/config';
import Axios from 'axios';
import { APIInstance } from '@/hooks/use-client';

const axiosInstance = Axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.data) {
      throw error.response.data;
    }

    throw error;
  },
);

const getServerAPI = async (): Promise<APIInstance> => {
  const session = await auth();
  const accessToken = session?.user?.accessToken;

  if (accessToken) {
    axiosInstance.defaults.headers['Authorization'] = accessToken;
  } else {
    axiosInstance.defaults.headers['Authorization'] = '';
  }

  return { axios: axiosInstance, enabled: true };
};

export { axiosInstance };

export default getServerAPI;
