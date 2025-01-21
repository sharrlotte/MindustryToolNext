import Axios from 'axios';

import env from '@/constant/env';

class StatusError extends Error {
  status: number;

  constructor(status: number, message: string, error: any) {
    super(message, {
      cause: error,
    });
    this.status = status;
  }
}

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
      throw new StatusError(error.response.data.status, error.response.data.message, error);
    }

    if (error.errno === -4078) {
      throw new StatusError(503, 'Service is unavailable, please try again later', error);
    }

    if ('code' in error) {
      const code = error.code;

      if (code === 'ERR_NETWORK') {
        if (!navigator?.onLine) {
          throw new StatusError(503, 'You are offline', error);
        } else {
          throw new StatusError(503, 'Network error', error);
        }
      }
    }

    console.error(
      JSON.stringify(
        error,
        Object.getOwnPropertyNames(error).filter((field) => field !== 'stack'),
      ),
    );

    throw new StatusError(500, 'An unknown error occurred', error);
  },
);

export default axiosInstance;
