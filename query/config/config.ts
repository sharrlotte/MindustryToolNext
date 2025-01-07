import Axios from 'axios';
import axios from 'axios';

import env from '@/constant/env';
import { getErrorMessage } from '@/lib/utils';

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
    if (error?.response?.data) {
      throw {
        message: error.response.data.message,
        status: error.response.data.status,
      };
    }

    if (error.errno === -4078 || error.code === 'ERR_BAD_RESPONSE') {
      console.error(error);
      throw {
        message: 'Service is unavailable, please try again later',
        status: 503,
      };
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error(getErrorMessage(error));
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

    if (error.message) {
      throw {
        message: error.message,
        status: error.status,
      };
    }

    if (axios.isAxiosError(error)) {
      throw new Error(getErrorMessage(error));
    }

    throw error;
  },
);

export default axiosInstance;
