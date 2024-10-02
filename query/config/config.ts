import Axios from 'axios';
import { notFound } from 'next/navigation';

import env from '@/constant/env';

const axiosInstance = Axios.create({
  baseURL: env.url.api,
  paramsSerializer: {
    indexes: null,
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.errno === -4078) {
      throw new Error('Service is unavailable, please try again later');
    }

    if (
      error.response?.data?.status === 404 &&
      error?.config?.method === 'get'
    ) {
      return notFound();
    }

    if (error?.response?.data) {
      throw {
        message: error.response.data.message,
        status: error.response.data.status,
      };
    }

    console.error({ Custom: error });

    throw error;
  },
);

export default axiosInstance;
