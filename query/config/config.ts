import Axios from 'axios';
import axios from 'axios';

import env from '@/constant/env';
import { getLoggedErrorMessage } from '@/lib/utils';

const axiosInstance = Axios.create({
  baseURL: env.url.api,
  timeout: env.requestTimeout,
  paramsSerializer: {
    indexes: null,
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.errno === -4078) {
      throw {
        message: 'Service is unavailable, please try again later',
        status: 503,
      };
    }

    if ('code' in error) {
      const code = error.code;

      if (code === 'ERR_NETWORK') {
        if (!navigator?.onLine) {
          throw {
            message: 'You are offline',
            status: 503,
          };
        } else
          throw {
            message: 'Service is unavailable, please try again later',
            status: 503,
          };
      }
    }

    if (error?.response?.data) {
      throw {
        message: error.response.data.message,
        status: error.response.data.status,
      };
    }

    if (axios.isAxiosError(error)) {
      throw new Error(getLoggedErrorMessage(error));
    }

    throw error;
  },
);

export default axiosInstance;
